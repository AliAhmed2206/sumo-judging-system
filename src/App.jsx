import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import MatchJudgeView from './components/MatchJudgeView';
import BracketView from './components/BracketView';
import ScheduleView from './components/ScheduleView';
import HomologationView from './components/HomologationView';
import TeamsView from './components/TeamsView';
import SpecialPrizesView from './components/SpecialPrizesView';
import RulesView from './components/RulesView';

import { INITIAL_TEAMS, INITIAL_MATCHES, DEFAULT_JUDGES, TOURNAMENT_METADATA } from './data/initialData';
import { HistoryTracker } from './utils/historyManager';
import { 
  fetchRemoteState, 
  pushRemoteState, 
  mergeTournamentStates,
  getStoredUserRole, 
  setStoredUserRole, 
  UserRole,
  getClientId
} from './utils/cloudSync';

const STORAGE_KEY = 'sumo_robot_championship_ejust_v6_one_system';

export default function App() {
  const [activeTab, setActiveTab] = useState('ring');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // User Role (Judge vs Spectator)
  const [userRole, setUserRoleState] = useState(getStoredUserRole);
  const setUserRole = (newRole) => {
    setUserRoleState(newRole);
    setStoredUserRole(newRole);
    showToast(newRole === UserRole.JUDGE ? 'Referee Mode Enabled (Scores & Homologation Editable)' : 'Switched to Read-Only Spectator View');
  };

  // Cloud Sync Status & Timing
  const [syncStatus, setSyncStatus] = useState('CONNECTING'); // 'CONNECTING' | 'CONNECTED' | 'SYNCING' | 'OFFLINE'
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [isInitialHydrated, setIsInitialHydrated] = useState(false);

  // Timestamp of the most recent local user edit (prevents polling collision)
  const lastLocalEditTimeRef = useRef(0);

  // Initial fallback baseline
  const getInitialFallback = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.teams && parsed.matches) {
          return parsed;
        }
      }
    } catch {}
    return {
      teams: INITIAL_TEAMS,
      matches: INITIAL_MATCHES,
      judges: DEFAULT_JUDGES,
      prizeEvaluations: {},
      revision: 0,
      lastUpdated: '1970-01-01T00:00:00.000Z'
    };
  };

  const [tournamentState, setTournamentState] = useState(getInitialFallback);

  // History Tracker instance for local Undo/Redo
  const historyRef = useRef(new HistoryTracker(tournamentState));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateHistoryFlags = useCallback(() => {
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Keep localStorage updated as local fallback cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tournamentState));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [tournamentState]);

  // Universal State Mutation: Writes locally, tracks timestamp, and immediately broadcasts to cloud
  const mutateTournamentState = (updater, actionName = 'Update') => {
    lastLocalEditTimeRef.current = Date.now();
    const nowIso = new Date().toISOString();

    setTournamentState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const updatedState = {
        ...next,
        revision: (prev.revision || 0) + 1,
        lastUpdated: nowIso,
        lastEditor: getClientId()
      };

      historyRef.current.pushState(updatedState, actionName);
      updateHistoryFlags();

      // Instant cloud broadcast
      setSyncStatus('SYNCING');
      pushRemoteState(updatedState).then(ok => {
        if (ok) {
          setSyncStatus('CONNECTED');
          setLastSyncedAt(new Date().toLocaleTimeString());
        } else {
          setSyncStatus('OFFLINE');
        }
      });

      return updatedState;
    });
  };

  // High-Frequency Unified Cloud Poller (Every 1.5 seconds)
  // Ensures ALL devices stay on the exact same live tournament system
  useEffect(() => {
    let isSubscribed = true;

    const syncWithCloud = async () => {
      try {
        const remote = await fetchRemoteState();
        if (!isSubscribed) return;

        if (remote) {
          setTournamentState(local => {
            const merged = mergeTournamentStates(local, remote, lastLocalEditTimeRef.current);
            const localSig = `${local.revision}_${local.lastUpdated}`;
            const mergedSig = `${merged.revision}_${merged.lastUpdated}`;

            if (localSig !== mergedSig || !isInitialHydrated) {
              setLastSyncedAt(new Date().toLocaleTimeString());
              setSyncStatus('CONNECTED');
              setIsInitialHydrated(true);
              return merged;
            }
            setSyncStatus('CONNECTED');
            return local;
          });
        } else {
          // If remote is empty but local has real data, initialize cloud
          setTournamentState(local => {
            if ((local.revision || 0) > 0) {
              pushRemoteState(local);
            }
            setSyncStatus('CONNECTED');
            return local;
          });
        }
      } catch (err) {
        console.warn('Sync tick error', err);
        setSyncStatus('OFFLINE');
      }
    };

    // Immediate initial sync on component mount
    syncWithCloud();

    // Fast 1.5-second live loop
    const interval = setInterval(syncWithCloud, 1500);
    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [isInitialHydrated]);

  // Hard Refresh from Cloud (One-Tap Fix for any device that feels out-of-sync)
  const handleHardRefreshFromCloud = async () => {
    setSyncStatus('SYNCING');
    showToast('Connecting directly to live cloud ledger...');
    try {
      localStorage.removeItem(STORAGE_KEY);
      const remote = await fetchRemoteState();
      if (remote) {
        setTournamentState(remote);
        setSyncStatus('CONNECTED');
        setLastSyncedAt(new Date().toLocaleTimeString());
        showToast(`Synced! Live Ledger Revision #${remote.revision || 0}`);
      } else {
        await pushRemoteState(tournamentState);
        setSyncStatus('CONNECTED');
        showToast('Connected to cloud!');
      }
    } catch {
      setSyncStatus('OFFLINE');
      showToast('Unable to reach cloud. Check internet.');
    }
  };

  // Share Live Link to Clipboard
  const handleShareLink = () => {
    const url = window.location.href.split('?')[0];
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Copied live link to clipboard!');
      }).catch(() => {
        prompt('Copy this live link for spectators:', url);
      });
    } else {
      prompt('Copy this live link for spectators:', url);
    }
  };

  // Undo Handler
  const handleUndo = useCallback(() => {
    const result = historyRef.current.undo();
    if (result) {
      lastLocalEditTimeRef.current = Date.now();
      const nowIso = new Date().toISOString();
      const updated = {
        ...result.state,
        lastUpdated: nowIso,
        revision: (result.state.revision || 0) + 1,
        lastEditor: getClientId()
      };
      setTournamentState(updated);
      updateHistoryFlags();
      pushRemoteState(updated);
      showToast(`Undid: ${result.undoneAction}`);
    }
  }, [updateHistoryFlags]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    const result = historyRef.current.redo();
    if (result) {
      lastLocalEditTimeRef.current = Date.now();
      const nowIso = new Date().toISOString();
      const updated = {
        ...result.state,
        lastUpdated: nowIso,
        revision: (result.state.revision || 0) + 1,
        lastEditor: getClientId()
      };
      setTournamentState(updated);
      updateHistoryFlags();
      pushRemoteState(updated);
      showToast(`Redid: ${result.redoneAction}`);
    }
  }, [updateHistoryFlags]);

  // Global Keyboard Shortcuts (Ctrl+Z for Undo, Ctrl+Y or Ctrl+Shift+Z for Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (userRole !== UserRole.JUDGE) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' || e.key === 'Z') {
          if (e.shiftKey) {
            e.preventDefault();
            handleRedo();
          } else {
            e.preventDefault();
            handleUndo();
          }
        } else if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, userRole]);

  // Match Scoring & Automatic Advancement (Attaches specific updatedAt to target match)
  const handleFinishMatch = (matchId, winnerId, loserId, finalScoreA, finalScoreB) => {
    const nowIso = new Date().toISOString();
    mutateTournamentState(prev => {
      const matches = prev.matches.map(m => ({ ...m }));
      const targetMatchIndex = matches.findIndex(m => m.id === matchId);
      if (targetMatchIndex === -1) return prev;

      const targetMatch = matches[targetMatchIndex];
      targetMatch.status = 'COMPLETED';
      targetMatch.winnerId = winnerId;
      targetMatch.loserId = loserId;
      targetMatch.scoreA = finalScoreA;
      targetMatch.scoreB = finalScoreB;
      targetMatch.updatedAt = nowIso;

      // Advance Winner
      if (targetMatch.nextMatchId) {
        const nextMatch = matches.find(m => m.id === targetMatch.nextMatchId);
        if (nextMatch) {
          nextMatch.updatedAt = nowIso;
          if (targetMatch.nextMatchSlot === 'teamA') {
            nextMatch.teamAId = winnerId;
          } else {
            nextMatch.teamBId = winnerId;
          }
        }
      }

      // If Semi-Final, route Loser to 3rd-Place Playoff (M21)
      if (targetMatch.round === 'SEMI' && targetMatch.consolationMatchId) {
        const consolationMatch = matches.find(m => m.id === targetMatch.consolationMatchId);
        if (consolationMatch) {
          consolationMatch.updatedAt = nowIso;
          if (targetMatch.consolationSlot === 'teamA') {
            consolationMatch.teamAId = loserId;
          } else {
            consolationMatch.teamBId = loserId;
          }
        }
      }

      return {
        ...prev,
        matches
      };
    }, `Conclude Match ${matchId}`);
  };

  const handleUpdateMatchScore = (matchId, scoreA, scoreB, desc = 'Update Score') => {
    const nowIso = new Date().toISOString();
    mutateTournamentState(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === matchId ? { ...m, scoreA, scoreB, updatedAt: nowIso } : m)
    }), desc);
  };

  const handleSelectMatchForJudging = (matchId, arena) => {
    const nowIso = new Date().toISOString();
    setActiveTab('ring');
    mutateTournamentState(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === matchId && m.status === 'SCHEDULED' ? { ...m, status: 'LIVE', updatedAt: nowIso } : m)
    }), `Set Match ${matchId} Live`);
  };

  const handleUpdateTeam = (updatedTeam, desc = 'Update Team') => {
    const nowIso = new Date().toISOString();
    const teamWithTimestamp = {
      ...updatedTeam,
      updatedAt: nowIso
    };
    mutateTournamentState(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === updatedTeam.id ? teamWithTimestamp : t)
    }), desc);
  };

  const handleSavePrizeScore = (teamId, judgeId, scores, notes) => {
    const nowIso = new Date().toISOString();
    mutateTournamentState(prev => ({
      ...prev,
      prizeEvaluations: {
        ...prev.prizeEvaluations,
        [`${teamId}_${judgeId}`]: {
          ...scores,
          notes,
          timestamp: nowIso
        }
      }
    }), `Save Score for ${teamId} by ${judgeId}`);
  };

  const handleResetTournament = () => {
    if (window.confirm('Reset all match scores and homologation checks to the initial 22-team draw? You can undo this!')) {
      const nowIso = new Date().toISOString();
      const resetState = {
        teams: INITIAL_TEAMS,
        matches: INITIAL_MATCHES,
        judges: DEFAULT_JUDGES,
        prizeEvaluations: {},
        revision: (tournamentState.revision || 0) + 1,
        lastUpdated: nowIso,
        lastEditor: getClientId()
      };
      mutateTournamentState(resetState, 'Reset Tournament Draw');
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tournamentState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sumo_robot_tournament_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.teams && parsed.matches) {
          mutateTournamentState(parsed, 'Import Tournament Data');
          alert('Tournament data restored & synchronized to cloud!');
        } else {
          alert('Invalid tournament data file.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#0d0407] text-[#f4ede2] flex flex-col font-sans selection:bg-[#bd325e] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-3 right-4 z-50 px-3.5 py-2 rounded bg-[#1f0b14] border border-[#d99c26] text-[#f5b945] font-mono text-xs shadow-xl animate-fade-in flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f5b945] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar with Realtime Multi-Referee Sync Status & Actions */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tournamentState={tournamentState}
        onResetTournament={handleResetTournament}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onUndo={handleUndo}
        canUndo={canUndo}
        onRedo={handleRedo}
        canRedo={canRedo}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        userRole={userRole}
        setUserRole={setUserRole}
        syncStatus={syncStatus}
        lastSyncedAt={lastSyncedAt}
        onForceSync={handleHardRefreshFromCloud}
        onShareLink={handleShareLink}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 pt-4">
        {activeTab === 'ring' && (
          <MatchJudgeView
            tournamentState={tournamentState}
            onFinishMatch={handleFinishMatch}
            onUpdateMatchScore={handleUpdateMatchScore}
            onUndo={handleUndo}
            canUndo={canUndo}
            soundEnabled={soundEnabled}
            userRole={userRole}
            onUnlockJudgeMode={() => setUserRole(UserRole.JUDGE)}
          />
        )}

        {activeTab === 'bracket' && (
          <BracketView
            tournamentState={tournamentState}
            onSelectMatchForJudging={handleSelectMatchForJudging}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            tournamentState={tournamentState}
            onSelectMatchForJudging={handleSelectMatchForJudging}
          />
        )}

        {activeTab === 'homologation' && (
          <HomologationView
            tournamentState={tournamentState}
            onUpdateTeam={handleUpdateTeam}
            onUndo={handleUndo}
            canUndo={canUndo}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsView
            tournamentState={tournamentState}
            onUpdateTeam={handleUpdateTeam}
          />
        )}

        {activeTab === 'prizes' && (
          <SpecialPrizesView
            tournamentState={tournamentState}
            onSavePrizeScore={handleSavePrizeScore}
          />
        )}

        {activeTab === 'rules' && (
          <RulesView />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-[#1f0913] py-2.5 bg-[#090204] text-[10px] text-[#8c747d] font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#d99c26]">{TOURNAMENT_METADATA.title}</span>
            <span>•</span>
            <span>{TOURNAMENT_METADATA.organizer}</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">
              ● ONE LIVE SYSTEM · Rev #{tournamentState.revision || 0} {lastSyncedAt ? `(${lastSyncedAt})` : ''}
            </span>
          </div>
          <div>
            {TOURNAMENT_METADATA.host} | October 30, 2026 | Instant Multi-Device Consensus
          </div>
        </div>
      </footer>
    </div>
  );
}
