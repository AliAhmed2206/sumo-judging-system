import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Wine, 
  Trophy, 
  History,
  Maximize2,
  Columns,
  Square,
  Shield,
  Zap,
  Undo2
} from 'lucide-react';
import { playSound } from '../utils/soundEffects';
import { WIN_CONDITIONS } from '../data/initialData';

export default function MatchJudgeView({ 
  tournamentState, 
  onFinishMatch, 
  onUpdateMatchScore,
  onUndo,
  canUndo,
  soundEnabled 
}) {
  const [viewLayout, setViewLayout] = useState('SPLIT'); // 'SPLIT', 'ARENA_1', 'ARENA_2'

  // --- ARENA 1 STATE ---
  const [matchIdA1, setMatchIdA1] = useState('M01');
  const [timerA1, setTimerA1] = useState(120);
  const [runningA1, setRunningA1] = useState(false);
  const [modeA1, setModeA1] = useState('ROUND'); // 'ROUND', 'REST', 'STALL', 'EDGE_3S', 'CALL'
  const [roundA1, setRoundA1] = useState(1);
  const [warningsA1_A, setWarningsA1_A] = useState(0);
  const [warningsA1_B, setWarningsA1_B] = useState(0);

  // --- ARENA 2 STATE ---
  const [matchIdA2, setMatchIdA2] = useState('M02');
  const [timerA2, setTimerA2] = useState(120);
  const [runningA2, setRunningA2] = useState(false);
  const [modeA2, setModeA2] = useState('ROUND');
  const [roundA2, setRoundA2] = useState(1);
  const [warningsA2_A, setWarningsA2_A] = useState(0);
  const [warningsA2_B, setWarningsA2_B] = useState(0);

  // Bottle tiebreaker challenge modal states
  const [bottleModal, setBottleModal] = useState(null); // { arena: 'Arena 1' | 'Arena 2', matchId: 'M01', timeA: '', timeB: '' }
  const [eventLogs, setEventLogs] = useState([]);

  const getTeam = (teamId) => tournamentState.teams.find(t => t.id === teamId);
  const getMatch = (matchId) => tournamentState.matches.find(m => m.id === matchId);

  const arena1Matches = tournamentState.matches.filter(m => m.arena === 'Arena 1');
  const arena2Matches = tournamentState.matches.filter(m => m.arena === 'Arena 2');

  const matchA1 = getMatch(matchIdA1) || arena1Matches[0];
  const matchA2 = getMatch(matchIdA2) || arena2Matches[0];

  const teamA1_A = getTeam(matchA1?.teamAId);
  const teamA1_B = getTeam(matchA1?.teamBId);

  const teamA2_A = getTeam(matchA2?.teamAId);
  const teamA2_B = getTeam(matchA2?.teamBId);

  const addLog = (arena, text) => {
    setEventLogs(prev => [
      { time: new Date().toLocaleTimeString(), arena, text },
      ...prev.slice(0, 29)
    ]);
  };

  // --- ARENA 1 INDEPENDENT TIMER ---
  useEffect(() => {
    let interval = null;
    if (runningA1) {
      interval = setInterval(() => {
        setTimerA1(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setRunningA1(false);
            if (soundEnabled) playSound('buzzer');
            addLog('Arena 1', `Clock expired (${modeA1})`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningA1, modeA1, soundEnabled]);

  // --- ARENA 2 INDEPENDENT TIMER ---
  useEffect(() => {
    let interval = null;
    if (runningA2) {
      interval = setInterval(() => {
        setTimerA2(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setRunningA2(false);
            if (soundEnabled) playSound('buzzer');
            addLog('Arena 2', `Clock expired (${modeA2})`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [runningA2, modeA2, soundEnabled]);

  const resetArenaTimer = (arenaNum, mode) => {
    let secs = 120;
    if (mode === 'REST') secs = 60;
    else if (mode === 'STALL') secs = 10;
    else if (mode === 'EDGE_3S') secs = 3;
    else if (mode === 'CALL') secs = 300;

    if (arenaNum === 1) {
      setRunningA1(false);
      setModeA1(mode);
      setTimerA1(secs);
      addLog('Arena 1', `Timer reset to ${mode} (${secs}s)`);
    } else {
      setRunningA2(false);
      setModeA2(mode);
      setTimerA2(secs);
      addLog('Arena 2', `Timer reset to ${mode} (${secs}s)`);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Scoring
  const handleScore = (match, teamSlot, delta) => {
    if (!match) return;
    const currentA = match.scoreA || 0;
    const currentB = match.scoreB || 0;
    let nextA = currentA;
    let nextB = currentB;

    if (teamSlot === 'A') {
      nextA = Math.max(0, Math.min(2, currentA + delta));
    } else {
      nextB = Math.max(0, Math.min(2, currentB + delta));
    }

    if (soundEnabled && delta > 0) playSound('point');
    const winningTeam = teamSlot === 'A' ? getTeam(match.teamAId) : getTeam(match.teamBId);
    onUpdateMatchScore(match.id, nextA, nextB, `Score update: ${match.code} (${nextA} - ${nextB})`);
    addLog(match.arena, `${winningTeam?.name || teamSlot} score updated to ${teamSlot === 'A' ? nextA : nextB}`);
  };

  const handlePenalty = (arenaNum, teamCorner, reason) => {
    if (soundEnabled) playSound('foul');
    if (arenaNum === 1) {
      if (teamCorner === 'A') {
        const next = warningsA1_A + 1;
        setWarningsA1_A(next);
        addLog('Arena 1', `Warning #${next} to Red Corner (${teamA1_A?.name}): ${reason}`);
        if (next >= 2) handleScore(matchA1, 'B', 1);
      } else {
        const next = warningsA1_B + 1;
        setWarningsA1_B(next);
        addLog('Arena 1', `Warning #${next} to Blue Corner (${teamA1_B?.name}): ${reason}`);
        if (next >= 2) handleScore(matchA1, 'A', 1);
      }
    } else {
      if (teamCorner === 'A') {
        const next = warningsA2_A + 1;
        setWarningsA2_A(next);
        addLog('Arena 2', `Warning #${next} to Red Corner (${teamA2_A?.name}): ${reason}`);
        if (next >= 2) handleScore(matchA2, 'B', 1);
      } else {
        const next = warningsA2_B + 1;
        setWarningsA2_B(next);
        addLog('Arena 2', `Warning #${next} to Blue Corner (${teamA2_B?.name}): ${reason}`);
        if (next >= 2) handleScore(matchA2, 'A', 1);
      }
    }
  };

  const handleConcludeMatch = (match, winnerTeamId) => {
    if (!match || !winnerTeamId) return;
    const winner = winnerTeamId === match.teamAId ? getTeam(match.teamAId) : getTeam(match.teamBId);
    const loserId = winnerTeamId === match.teamAId ? match.teamBId : match.teamAId;

    if (soundEnabled) playSound('fanfare');
    onFinishMatch(match.id, winnerTeamId, loserId, match.scoreA || 0, match.scoreB || 0);
    addLog(match.arena, `Match ${match.code} concluded! Winner: ${winner?.name}`);
  };

  const handleBottleSubmit = () => {
    if (!bottleModal) return;
    const tA = parseFloat(bottleModal.timeA);
    const tB = parseFloat(bottleModal.timeB);
    const match = getMatch(bottleModal.matchId);

    if (isNaN(tA) || isNaN(tB)) {
      alert('Please enter valid times in seconds for both robots.');
      return;
    }

    if (tA < tB) {
      handleScore(match, 'A', 1);
      addLog(bottleModal.arena, `Bottle Challenge (§10.2): Red Corner (${tA.toFixed(2)}s) beat Blue Corner (${tB.toFixed(2)}s)`);
    } else if (tB < tA) {
      handleScore(match, 'B', 1);
      addLog(bottleModal.arena, `Bottle Challenge (§10.2): Blue Corner (${tB.toFixed(2)}s) beat Red Corner (${tA.toFixed(2)}s)`);
    } else {
      alert('Times identical. Please re-run trial.');
      return;
    }
    setBottleModal(null);
  };

  // Render a Single Arena Controller
  const renderArenaDeck = (arenaNum) => {
    const isA1 = arenaNum === 1;
    const arenaName = isA1 ? 'Arena 1' : 'Arena 2';
    const match = isA1 ? matchA1 : matchA2;
    const teamA = isA1 ? teamA1_A : teamA2_A;
    const teamB = isA1 ? teamA1_B : teamA2_B;
    const timerSecs = isA1 ? timerA1 : timerA2;
    const isRunning = isA1 ? runningA1 : runningA2;
    const timerMode = isA1 ? modeA1 : modeA2;
    const warningsA = isA1 ? warningsA1_A : warningsA2_A;
    const warningsB = isA1 ? warningsA1_B : warningsA2_B;
    const matchesList = isA1 ? arena1Matches : arena2Matches;
    const setMatchId = isA1 ? setMatchIdA1 : setMatchIdA2;

    const accentColor = isA1 ? '#d99c26' : '#bd325e';
    const tagBg = isA1 ? 'bg-[#d99c26] text-[#1b1002]' : 'bg-[#bd325e] text-white';

    return (
      <div className="rounded bg-[#14050d] border border-[#2d0e1b] p-3.5 space-y-3 flex flex-col justify-between shadow-sm">
        
        {/* Header: Arena Badge, Match Selector */}
        <div className="flex items-center justify-between pb-2 border-b border-[#240a15] text-xs">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-mono font-black text-[10px] uppercase tracking-wider ${tagBg}`}>
              {arenaName}
            </span>
            <span className="text-white font-mono font-bold">{match?.code || '—'}</span>
            <span className="text-[#a68f97] text-[11px] font-mono">{match?.scheduledTime || ''}</span>
          </div>

          <select
            value={match?.id || ''}
            onChange={(e) => setMatchId(e.target.value)}
            className="bg-[#0c0307] text-white border border-[#2d0e1b] rounded px-2 py-1 text-xs font-mono focus:outline-none focus:border-[#d99c26]"
          >
            {matchesList.map(m => {
              const mA = getTeam(m.teamAId);
              const mB = getTeam(m.teamBId);
              return (
                <option key={m.id} value={m.id}>
                  {m.code} [{m.scheduledTime}] {mA?.name || 'TBD'} vs {mB?.name || 'TBD'} {m.status === 'COMPLETED' ? '✓' : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Central Timer Deck */}
        <div className="p-3 rounded bg-[#0b0307] border border-[#200812] text-center">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#a68f97] mb-1">
            <span className="uppercase font-bold text-[#d99c26]">{timerMode} CLOCK</span>
            <span>Max 2:00 (§8.2)</span>
          </div>

          {/* Big Digits */}
          <div className={`text-4xl sm:text-5xl font-mono font-black tracking-tight ${
            timerSecs <= 10 && timerMode === 'ROUND' ? 'text-rose-500 animate-pulse' : 'text-white'
          }`}>
            {formatTime(timerSecs)}
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {!isRunning ? (
              <button
                onClick={() => {
                  if (isA1) setRunningA1(true); else setRunningA2(true);
                  if (soundEnabled) playSound('start');
                  addLog(arenaName, 'Timer started');
                }}
                className="px-4 py-1.5 rounded font-mono font-bold text-xs bg-[#d99c26] text-[#1b1002] hover:bg-[#f5b945] flex items-center gap-1 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>START</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isA1) setRunningA1(false); else setRunningA2(false);
                  if (soundEnabled) playSound('pause');
                  addLog(arenaName, 'Timer paused');
                }}
                className="px-4 py-1.5 rounded font-mono font-bold text-xs bg-amber-600 text-white hover:bg-amber-500 flex items-center gap-1 transition-colors"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </button>
            )}

            <button
              onClick={() => resetArenaTimer(arenaNum, timerMode)}
              className="p-1.5 rounded bg-[#1c0812] text-gray-300 border border-[#3b1222] hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (soundEnabled) playSound('buzzer');
                addLog(arenaName, 'Referee Horn sounded');
              }}
              className="p-1.5 rounded bg-[#1c0812] text-[#d99c26] border border-[#3b1222] hover:text-white"
              title="Sound Arena Horn"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timer Mode Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-1 mt-2.5 pt-2 border-t border-[#1a060e] text-[9px] font-mono">
            <button
              onClick={() => resetArenaTimer(arenaNum, 'ROUND')}
              className={`px-2 py-0.5 rounded border ${timerMode === 'ROUND' ? 'bg-[#d99c26] text-black font-bold border-[#d99c26]' : 'bg-[#120509] text-gray-400 border-[#240a15]'}`}
            >
              2:00 Round
            </button>
            <button
              onClick={() => resetArenaTimer(arenaNum, 'REST')}
              className={`px-2 py-0.5 rounded border ${timerMode === 'REST' ? 'bg-[#d99c26] text-black font-bold border-[#d99c26]' : 'bg-[#120509] text-gray-400 border-[#240a15]'}`}
            >
              1:00 Rest (§8.6)
            </button>
            <button
              onClick={() => resetArenaTimer(arenaNum, 'STALL')}
              className={`px-2 py-0.5 rounded border ${timerMode === 'STALL' ? 'bg-[#d99c26] text-black font-bold border-[#d99c26]' : 'bg-[#120509] text-gray-400 border-[#240a15]'}`}
            >
              10s Stall (§10.1)
            </button>
            <button
              onClick={() => resetArenaTimer(arenaNum, 'EDGE_3S')}
              className={`px-2 py-0.5 rounded border ${timerMode === 'EDGE_3S' ? 'bg-[#d99c26] text-black font-bold border-[#d99c26]' : 'bg-[#120509] text-gray-400 border-[#240a15]'}`}
            >
              3s Edge (§9.1)
            </button>
            <button
              onClick={() => resetArenaTimer(arenaNum, 'CALL')}
              className={`px-2 py-0.5 rounded border ${timerMode === 'CALL' ? 'bg-[#d99c26] text-black font-bold border-[#d99c26]' : 'bg-[#120509] text-gray-400 border-[#240a15]'}`}
            >
              5m Call (§3.2)
            </button>
          </div>
        </div>

        {/* Combatants Grid: RED vs BLUE */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          
          {/* RED CORNER */}
          <div className="p-2.5 rounded bg-[#10040a] border border-rose-950/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-rose-400 font-bold border-b border-[#240a15] pb-1">
              <span>RED CORNER</span>
              <span>#{teamA?.robotNumber || '-'}</span>
            </div>

            <div className="font-bold text-white truncate text-sm">
              {teamA ? teamA.name : <span className="text-gray-600 italic">TBD</span>}
            </div>
            <div className="text-[10px] text-[#a68f97] truncate font-mono">
              {teamA?.university || '—'}
            </div>

            {/* Score Points Box */}
            <div className="flex items-center justify-between p-2 rounded bg-[#090205] border border-[#1f0812]">
              <span className="font-mono text-[10px] text-gray-400 uppercase">Yuko:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-2xl text-[#d99c26]">{match?.scoreA || 0}</span>
                <div className="flex gap-1">
                  {[1, 2].map(pt => (
                    <div
                      key={pt}
                      className={`w-3 h-3 rounded-full border ${
                        (match?.scoreA || 0) >= pt ? 'bg-[#d99c26] border-[#d99c26]' : 'border-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                onClick={() => handleScore(match, 'A', 1)}
                disabled={!teamA}
                className="py-1.5 px-2 rounded font-mono font-bold text-[11px] bg-rose-900 text-white hover:bg-rose-800 disabled:opacity-30"
              >
                +1 Win
              </button>
              <button
                onClick={() => handleScore(match, 'A', -1)}
                disabled={!teamA || (match?.scoreA || 0) === 0}
                className="py-1.5 px-1 rounded font-mono text-[10px] bg-[#1a0812] text-gray-400 hover:text-white border border-[#2b0f19] disabled:opacity-30"
              >
                -1
              </button>
            </div>

            {/* Warning Counter */}
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
              <span>Foul: {warningsA}/2</span>
              <button
                onClick={() => handlePenalty(arenaNum, 'A', 'False Start / Stoppage')}
                className="text-rose-400 hover:underline"
              >
                +Warning (§8.4)
              </button>
            </div>
          </div>

          {/* BLUE CORNER */}
          <div className="p-2.5 rounded bg-[#0b0c16] border border-blue-950/80 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-blue-400 font-bold border-b border-[#141b2c] pb-1">
              <span>BLUE CORNER</span>
              <span>#{teamB?.robotNumber || '-'}</span>
            </div>

            <div className="font-bold text-white truncate text-sm">
              {teamB ? teamB.name : <span className="text-gray-600 italic">TBD</span>}
            </div>
            <div className="text-[10px] text-[#a68f97] truncate font-mono">
              {teamB?.university || '—'}
            </div>

            {/* Score Points Box */}
            <div className="flex items-center justify-between p-2 rounded bg-[#07080f] border border-[#141b2c]">
              <span className="font-mono text-[10px] text-gray-400 uppercase">Yuko:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-2xl text-blue-400">{match?.scoreB || 0}</span>
                <div className="flex gap-1">
                  {[1, 2].map(pt => (
                    <div
                      key={pt}
                      className={`w-3 h-3 rounded-full border ${
                        (match?.scoreB || 0) >= pt ? 'bg-blue-500 border-blue-500' : 'border-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                onClick={() => handleScore(match, 'B', 1)}
                disabled={!teamB}
                className="py-1.5 px-2 rounded font-mono font-bold text-[11px] bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-30"
              >
                +1 Win
              </button>
              <button
                onClick={() => handleScore(match, 'B', -1)}
                disabled={!teamB || (match?.scoreB || 0) === 0}
                className="py-1.5 px-1 rounded font-mono text-[10px] bg-[#101424] text-gray-400 hover:text-white border border-[#1e2742] disabled:opacity-30"
              >
                -1
              </button>
            </div>

            {/* Warning Counter */}
            <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1">
              <span>Foul: {warningsB}/2</span>
              <button
                onClick={() => handlePenalty(arenaNum, 'B', 'False Start / Stoppage')}
                className="text-blue-400 hover:underline"
              >
                +Warning (§8.4)
              </button>
            </div>
          </div>

        </div>

        {/* Action Bar: Bottle Challenge & Conclude Match */}
        <div className="pt-2 border-t border-[#240a15] flex items-center justify-between gap-2 text-xs">
          <button
            onClick={() => setBottleModal({ arena: arenaName, matchId: match?.id, timeA: '', timeB: '' })}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1c0812] text-[#d99c26] border border-[#3b1222] font-mono text-[10px] hover:bg-[#280c1a]"
          >
            <Wine className="w-3.5 h-3.5" />
            <span>Bottle Challenge (§10.2)</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleConcludeMatch(match, teamA?.id)}
              disabled={!teamA}
              className="px-2.5 py-1.5 rounded bg-[#2a0e19] text-rose-300 font-mono font-bold text-[10px] border border-rose-900/60 hover:bg-rose-950 disabled:opacity-30"
            >
              Red Wins
            </button>
            <button
              onClick={() => handleConcludeMatch(match, teamB?.id)}
              disabled={!teamB}
              className="px-2.5 py-1.5 rounded bg-[#0d162b] text-blue-300 font-mono font-bold text-[10px] border border-blue-900/60 hover:bg-blue-950 disabled:opacity-30"
            >
              Blue Wins
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Top Deck Toolbar */}
      <div className="flex items-center justify-between p-2.5 rounded bg-[#14050d] border border-[#2d0e1b] text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-white">
            <Shield className="w-4 h-4 text-[#d99c26]" />
            <span>DUAL ARENA REFEREE DESK</span>
          </div>
          <span className="text-[10px] font-mono text-[#a68f97] hidden sm:inline">
            Both rings run simultaneously • Independent timers & scorebooks
          </span>
        </div>

        {/* Layout Switcher & Undo Shortcut */}
        <div className="flex items-center gap-2">
          {canUndo && (
            <button
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#200913] text-[#d99c26] border border-[#3b1222] font-mono text-[11px] font-bold hover:bg-[#2e0e1d]"
              title="Undo last action (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo (Ctrl+Z)</span>
            </button>
          )}

          <div className="flex items-center p-0.5 rounded bg-[#0b0307] border border-[#200812] font-mono text-[10px]">
            <button
              onClick={() => setViewLayout('SPLIT')}
              className={`px-2 py-1 rounded ${viewLayout === 'SPLIT' ? 'bg-[#d99c26] text-black font-bold' : 'text-gray-400'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewLayout('ARENA_1')}
              className={`px-2 py-1 rounded ${viewLayout === 'ARENA_1' ? 'bg-[#d99c26] text-black font-bold' : 'text-gray-400'}`}
            >
              Arena 1
            </button>
            <button
              onClick={() => setViewLayout('ARENA_2')}
              className={`px-2 py-1 rounded ${viewLayout === 'ARENA_2' ? 'bg-[#bd325e] text-white font-bold' : 'text-gray-400'}`}
            >
              Arena 2
            </button>
          </div>
        </div>
      </div>

      {/* Arena Decks Grid */}
      <div className={`grid gap-4 ${
        viewLayout === 'SPLIT' 
          ? 'grid-cols-1 lg:grid-cols-2' 
          : 'grid-cols-1'
      }`}>
        {(viewLayout === 'SPLIT' || viewLayout === 'ARENA_1') && renderArenaDeck(1)}
        {(viewLayout === 'SPLIT' || viewLayout === 'ARENA_2') && renderArenaDeck(2)}
      </div>

      {/* Bottle Tiebreaker Challenge Modal (§10.2) */}
      {bottleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded bg-[#14060d] border border-[#d99c26] p-4 shadow-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#240a15]">
              <span className="font-bold text-[#d99c26] flex items-center gap-1.5">
                <Wine className="w-4 h-4" />
                <span>Bottle Tiebreaker ({bottleModal.arena})</span>
              </span>
              <button onClick={() => setBottleModal(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <p className="text-[11px] text-gray-300 font-sans leading-relaxed">
              Robots attempt individually to displace the bottle at ring end. Shortest elapsed time wins the round.
            </p>

            <div className="space-y-2">
              <div>
                <label className="text-gray-400 block text-[10px]">Red Corner Time (sec):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 4.12"
                  value={bottleModal.timeA}
                  onChange={(e) => setBottleModal({ ...bottleModal, timeA: e.target.value })}
                  className="w-full bg-[#0a0205] text-white border border-[#2d0e1b] rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#d99c26]"
                />
              </div>

              <div>
                <label className="text-gray-400 block text-[10px]">Blue Corner Time (sec):</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5.34"
                  value={bottleModal.timeB}
                  onChange={(e) => setBottleModal({ ...bottleModal, timeB: e.target.value })}
                  className="w-full bg-[#0a0205] text-white border border-[#2d0e1b] rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#d99c26]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#240a15]">
              <button
                onClick={() => setBottleModal(null)}
                className="px-3 py-1 rounded bg-[#1c0812] text-gray-400 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleBottleSubmit}
                className="px-3 py-1 rounded bg-[#d99c26] text-black font-bold text-xs hover:bg-[#f5b945]"
              >
                Award Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Concurrent Telemetry Feed */}
      <div className="p-3 rounded bg-[#100409] border border-[#240a15] font-mono text-xs">
        <div className="flex items-center gap-1.5 text-[10px] text-[#a68f97] font-bold uppercase mb-1.5">
          <History className="w-3.5 h-3.5 text-[#d99c26]" />
          <span>Real-time Ring Telemetry (Both Arenas)</span>
        </div>
        <div className="h-20 overflow-y-auto space-y-1 text-[11px] pr-2">
          {eventLogs.length === 0 ? (
            <div className="text-gray-600 italic">No ring events recorded yet. Ready for start.</div>
          ) : (
            eventLogs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-300 border-b border-[#1a060e] pb-0.5">
                <span className="text-gray-500">{log.time}</span>
                <span className="text-[#d99c26] font-bold">[{log.arena}]</span>
                <span>{log.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
