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

const STORAGE_KEY = 'sumo_robot_championship_ejust_v4_minimal_undo';

export default function App() {
  const [activeTab, setActiveTab] = useState('ring');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial state
  const loadInitialData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.teams && parsed.matches) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return {
      teams: INITIAL_TEAMS,
      matches: INITIAL_MATCHES,
      judges: DEFAULT_JUDGES,
      prizeEvaluations: {},
      lastUpdated: new Date().toISOString()
    };
  };

  const [tournamentState, setTournamentState] = useState(loadInitialData);

  // History Tracker instance
  const historyRef = useRef(new HistoryTracker(tournamentState));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Sync canUndo/canRedo flags
  const updateHistoryFlags = useCallback(() => {
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tournamentState));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [tournamentState]);

  // Universal State Mutation with Action Tracking
  const mutateTournamentState = (updater, actionName = 'Update') => {
    setTournamentState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      historyRef.current.pushState(next, actionName);
      updateHistoryFlags();
      return next;
    });
  };

  // Undo Handler
  const handleUndo = useCallback(() => {
    const result = historyRef.current.undo();
    if (result) {
      setTournamentState(result.state);
      updateHistoryFlags();
      showToast(`Undid: ${result.undoneAction}`);
    }
  }, [updateHistoryFlags]);

  // Redo Handler
  const handleRedo = useCallback(() => {
    const result = historyRef.current.redo();
    if (result) {
      setTournamentState(result.state);
      updateHistoryFlags();
      showToast(`Redid: ${result.redoneAction}`);
    }
  }, [updateHistoryFlags]);

  // Global Keyboard Shortcuts (Ctrl+Z for Undo, Ctrl+Y or Ctrl+Shift+Z for Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when focused in text inputs unless it's Ctrl+Z
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
  }, [handleUndo, handleRedo]);

  // Match Scoring & Automatic Advancement
  const handleFinishMatch = (matchId, winnerId, loserId, finalScoreA, finalScoreB) => {
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

      // Advance Winner
      if (targetMatch.nextMatchId) {
        const nextMatch = matches.find(m => m.id === targetMatch.nextMatchId);
        if (nextMatch) {
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
          if (targetMatch.consolationSlot === 'teamA') {
            consolationMatch.teamAId = loserId;
          } else {
            consolationMatch.teamBId = loserId;
          }
        }
      }

      return {
        ...prev,
        matches,
        lastUpdated: new Date().toISOString()
      };
    }, `Conclude Match ${matchId}`);
  };

  const handleUpdateMatchScore = (matchId, scoreA, scoreB, desc = 'Update Score') => {
    mutateTournamentState(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === matchId ? { ...m, scoreA, scoreB } : m),
      lastUpdated: new Date().toISOString()
    }), desc);
  };

  const handleSelectMatchForJudging = (matchId, arena) => {
    setActiveTab('ring');
    mutateTournamentState(prev => ({
      ...prev,
      matches: prev.matches.map(m => m.id === matchId && m.status === 'SCHEDULED' ? { ...m, status: 'LIVE' } : m)
    }), `Set Match ${matchId} Live`);
  };

  const handleUpdateTeam = (updatedTeam, desc = 'Update Team') => {
    mutateTournamentState(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === updatedTeam.id ? updatedTeam : t),
      lastUpdated: new Date().toISOString()
    }), desc);
  };

  const handleSavePrizeScore = (teamId, judgeId, scores, notes) => {
    mutateTournamentState(prev => ({
      ...prev,
      prizeEvaluations: {
        ...prev.prizeEvaluations,
        [`${teamId}_${judgeId}`]: {
          ...scores,
          notes,
          timestamp: new Date().toISOString()
        }
      },
      lastUpdated: new Date().toISOString()
    }), `Save Score for ${teamId} by ${judgeId}`);
  };

  const handleResetTournament = () => {
    if (window.confirm('Reset all match scores and homologation checks to the initial 22-team draw? You can undo this!')) {
      const resetState = {
        teams: INITIAL_TEAMS,
        matches: INITIAL_MATCHES,
        judges: DEFAULT_JUDGES,
        prizeEvaluations: {},
        lastUpdated: new Date().toISOString()
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
          alert('Tournament data restored!');
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
        <div className="fixed top-3 right-4 z-50 px-3 py-1.5 rounded bg-[#1f0b14] border border-[#d99c26] text-[#f5b945] font-mono text-xs shadow-xl animate-fade-in flex items-center gap-1.5">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar with Undo/Redo & Tabs */}
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
          </div>
          <div>
            {TOURNAMENT_METADATA.host} | October 30, 2026 | Press Ctrl+Z to Undo any action
          </div>
        </div>
      </footer>
    </div>
  );
}
