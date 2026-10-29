import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Swords, 
  Award, 
  ExternalLink,
  ChevronRight,
  Shield,
  Zap,
  GitBranch,
  ArrowRight,
  Info,
  CheckCircle2,
  Sparkles,
  Layers,
  Flame
} from 'lucide-react';
import { TOURNAMENT_METADATA } from '../data/initialData';

// Geometry constants for precision bracket schematic
const CARD_W = 224;
const CARD_H = 84;
const ROW_H = 114;
const GAP_X = 54;
const HEADER_H = 54;

export default function BracketView({ 
  tournamentState, 
  onSelectMatchForJudging 
}) {
  const [activeModalMatch, setActiveModalMatch] = useState(null);
  const [hoveredMatchId, setHoveredMatchId] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState('ALL'); // 'ALL' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'FINALS'

  const getTeam = (teamId) => tournamentState.teams.find(t => t.id === teamId);
  const getMatch = (matchId) => tournamentState.matches.find(m => m.id === matchId);

  // Exact 8-row tree mapping as specified in the Section 13 tournament handbook
  // Row 0 to 7 coordinates:
  const getRowY = (rowIndex) => HEADER_H + rowIndex * ROW_H + (ROW_H / 2);
  const getCardTop = (centerY) => centerY - (CARD_H / 2);
  const getColX = (colIndex) => colIndex * (CARD_W + GAP_X);

  // Y centers for each round's cards
  // Col 0 & Col 1: 8 rows
  const rowCenters = [0, 1, 2, 3, 4, 5, 6, 7].map(getRowY);

  // Col 2 (Quarter-Finals): 4 matches
  const qfCenters = [
    (rowCenters[0] + rowCenters[1]) / 2, // QF1 (M17) = ~168px
    (rowCenters[2] + rowCenters[3]) / 2, // QF2 (M15) = ~396px
    (rowCenters[4] + rowCenters[5]) / 2, // QF3 (M16) = ~624px
    (rowCenters[6] + rowCenters[7]) / 2  // QF4 (M18) = ~852px
  ];

  // Col 3 (Semi-Finals): 2 matches
  const sfCenters = [
    (qfCenters[0] + qfCenters[1]) / 2,   // SF1 (M19) = ~282px
    (qfCenters[2] + qfCenters[3]) / 2    // SF2 (M20) = ~738px
  ];

  // Col 4 (Finals):
  const finalCenter = (sfCenters[0] + sfCenters[1]) / 2; // The Final (M22) = ~510px
  const thirdPlaceCenter = 690; // 3rd Place Match (M21) = 690px

  // Champion Team
  const finalMatch = getMatch('M22');
  const thirdPlaceMatch = getMatch('M21');
  const championTeam = finalMatch?.winnerId ? getTeam(finalMatch.winnerId) : null;
  const thirdPlaceTeam = thirdPlaceMatch?.winnerId ? getTeam(thirdPlaceMatch.winnerId) : null;

  // Active Lineage Tracker for hovered or selected match
  const activeLineage = useMemo(() => {
    if (!hoveredMatchId && selectedQuarter === 'ALL') return null;

    const matchSet = new Set();
    const branchPath = [];

    if (hoveredMatchId) {
      // Find ancestors (backward)
      const findAncestors = (mId) => {
        const m = getMatch(mId);
        if (!m) return;
        matchSet.add(m.id);
        if (m.sourceMatchA) {
          matchSet.add(m.sourceMatchA);
          findAncestors(m.sourceMatchA);
        }
        if (m.sourceMatchB) {
          matchSet.add(m.sourceMatchB);
          findAncestors(m.sourceMatchB);
        }
      };

      // Find descendants (forward)
      const findDescendants = (mId) => {
        const m = getMatch(mId);
        if (!m) return;
        matchSet.add(m.id);
        if (m.nextMatchId) {
          matchSet.add(m.nextMatchId);
          findDescendants(m.nextMatchId);
        }
        if (m.consolationMatchId) {
          matchSet.add(m.consolationMatchId);
        }
      };

      findAncestors(hoveredMatchId);
      findDescendants(hoveredMatchId);

      // Also sort in chronological order for breadcrumb
      const ordered = Array.from(matchSet)
        .map(getMatch)
        .filter(Boolean)
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

      return {
        matchSet,
        breadcrumbs: ordered
      };
    }

    if (selectedQuarter !== 'ALL') {
      const qMatches = {
        Q1: ['M09', 'M10', 'M13', 'M14', 'M17', 'M19', 'M22'],
        Q2: ['M05', 'M04', 'M11', 'M15', 'M19', 'M22'],
        Q3: ['M01', 'M03', 'M06', 'M12', 'M16', 'M20', 'M22'],
        Q4: ['M02', 'M07', 'M08', 'M18', 'M20', 'M22'],
        FINALS: ['M19', 'M20', 'M21', 'M22']
      }[selectedQuarter] || [];

      qMatches.forEach(id => matchSet.add(id));
      return {
        matchSet,
        breadcrumbs: qMatches.map(getMatch).filter(Boolean)
      };
    }

    return null;
  }, [hoveredMatchId, selectedQuarter, tournamentState.matches]);

  // Branch Connectors definitions
  // Each connector describes branch line between rounds
  const connectors = useMemo(() => {
    const list = [];

    // --- Col 0 (Play-In) to Col 1 (R16) ---
    // M09 -> M13
    list.push({
      id: 'c-M09-M13',
      from: 'M09',
      to: 'M13',
      type: 'straight',
      x1: getColX(0) + CARD_W,
      y1: rowCenters[0],
      x2: getColX(1),
      y2: rowCenters[0],
      quarter: 'Q1'
    });
    // M10 -> M14
    list.push({
      id: 'c-M10-M14',
      from: 'M10',
      to: 'M14',
      type: 'straight',
      x1: getColX(0) + CARD_W,
      y1: rowCenters[1],
      x2: getColX(1),
      y2: rowCenters[1],
      quarter: 'Q1'
    });
    // BYE Row 2 -> M04
    list.push({
      id: 'c-BYE1-M04',
      from: 'BYE_Q2',
      to: 'M04',
      type: 'bypass',
      x1: getColX(0) + CARD_W,
      y1: rowCenters[2],
      x2: getColX(1),
      y2: rowCenters[2],
      quarter: 'Q2'
    });
    // M05 -> M11
    list.push({
      id: 'c-M05-M11',
      from: 'M05',
      to: 'M11',
      type: 'straight',
      x1: getColX(0) + CARD_W,
      y1: rowCenters[3],
      x2: getColX(1),
      y2: rowCenters[3],
      quarter: 'Q2'
    });
    // M01 -> M06
    list.push({
      id: 'c-M01-M06',
      from: 'M01',
      to: 'M06',
      type: 'straight',
      x1: getColX(0) + CARD_W,
      y1: rowCenters[4],
      x2: getColX(1),
      y2: rowCenters[4],
      quarter: 'Q3'
    });
    // M03 -> M12
    list.push({
      id: 'c-M03-M12',
      from: 'M03',
      to: 'M12',
      type: 'straight',
      x1: getColX(0) + CARD_W,
      y1: rowCenters[5],
      x2: getColX(1),
      y2: rowCenters[5],
      quarter: 'Q3'
    });
    // M02 -> M07
    list.push({
      id: 'c-M02-M07',
      from: 'M02',
      to: 'M07',
      type: 'straight',
      x1: getColX(0) + CARD_W,
      y1: rowCenters[6],
      x2: getColX(1),
      y2: rowCenters[6],
      quarter: 'Q4'
    });
    // BYE Row 7 -> M08
    list.push({
      id: 'c-BYE2-M08',
      from: 'BYE_Q4',
      to: 'M08',
      type: 'bypass',
      x1: getColX(0) + CARD_W,
      y1: rowCenters[7],
      x2: getColX(1),
      y2: rowCenters[7],
      quarter: 'Q4'
    });

    // --- Col 1 (R16) to Col 2 (Quarter-Finals) ---
    // Fork 1: M13 + M14 -> M17 (Q1)
    list.push({
      id: 'fork-M13-M14-M17',
      fromA: 'M13',
      fromB: 'M14',
      to: 'M17',
      type: 'fork',
      x1: getColX(1) + CARD_W,
      yA: rowCenters[0],
      yB: rowCenters[1],
      x2: getColX(2),
      yT: qfCenters[0],
      quarter: 'Q1'
    });
    // Fork 2: M04 + M11 -> M15 (Q2)
    list.push({
      id: 'fork-M04-M11-M15',
      fromA: 'M04',
      fromB: 'M11',
      to: 'M15',
      type: 'fork',
      x1: getColX(1) + CARD_W,
      yA: rowCenters[2],
      yB: rowCenters[3],
      x2: getColX(2),
      yT: qfCenters[1],
      quarter: 'Q2'
    });
    // Fork 3: M06 + M12 -> M16 (Q3)
    list.push({
      id: 'fork-M06-M12-M16',
      fromA: 'M06',
      fromB: 'M12',
      to: 'M16',
      type: 'fork',
      x1: getColX(1) + CARD_W,
      yA: rowCenters[4],
      yB: rowCenters[5],
      x2: getColX(2),
      yT: qfCenters[2],
      quarter: 'Q3'
    });
    // Fork 4: M07 + M08 -> M18 (Q4)
    list.push({
      id: 'fork-M07-M08-M18',
      fromA: 'M07',
      fromB: 'M08',
      to: 'M18',
      type: 'fork',
      x1: getColX(1) + CARD_W,
      yA: rowCenters[6],
      yB: rowCenters[7],
      x2: getColX(2),
      yT: qfCenters[3],
      quarter: 'Q4'
    });

    // --- Col 2 (QF) to Col 3 (Semi-Finals) ---
    // Fork 5: M17 + M15 -> M19 (Top Half Semi)
    list.push({
      id: 'fork-M17-M15-M19',
      fromA: 'M17',
      fromB: 'M15',
      to: 'M19',
      type: 'fork',
      x1: getColX(2) + CARD_W,
      yA: qfCenters[0],
      yB: qfCenters[1],
      x2: getColX(3),
      yT: sfCenters[0],
      quarter: 'TOP_HALF'
    });
    // Fork 6: M16 + M18 -> M20 (Bottom Half Semi)
    list.push({
      id: 'fork-M16-M18-M20',
      fromA: 'M16',
      fromB: 'M18',
      to: 'M20',
      type: 'fork',
      x1: getColX(2) + CARD_W,
      yA: qfCenters[2],
      yB: qfCenters[3],
      x2: getColX(3),
      yT: sfCenters[1],
      quarter: 'BOTTOM_HALF'
    });

    // --- Col 3 (SF) to Col 4 (Finals & 3rd-Place) ---
    // Fork 7: M19 + M20 -> M22 (The Championship Final)
    list.push({
      id: 'fork-M19-M20-M22',
      fromA: 'M19',
      fromB: 'M20',
      to: 'M22',
      type: 'fork',
      x1: getColX(3) + CARD_W,
      yA: sfCenters[0],
      yB: sfCenters[1],
      x2: getColX(4),
      yT: finalCenter,
      quarter: 'FINALS'
    });

    // Consolation lines: M19 & M20 losers -> M21 (3rd Place Match)
    list.push({
      id: 'consolation-M19-M20-M21',
      fromA: 'M19',
      fromB: 'M20',
      to: 'M21',
      type: 'consolation',
      x1: getColX(3) + CARD_W,
      yA: sfCenters[0],
      yB: sfCenters[1],
      x2: getColX(4),
      yT: thirdPlaceCenter,
      quarter: 'FINALS'
    });

    // --- Col 4 (M22) to Col 5 (1st Place Podium) ---
    list.push({
      id: 'c-M22-CHAMPION',
      from: 'M22',
      to: 'PODIUM',
      type: 'champion',
      x1: getColX(4) + CARD_W,
      y1: finalCenter,
      x2: getColX(5),
      y2: finalCenter,
      quarter: 'FINALS'
    });

    return list;
  }, [rowCenters, qfCenters, sfCenters, finalCenter, thirdPlaceCenter]);

  // Match Card Component
  const renderCard = (matchId, left, top, customNextLabel = null, isDirectCard = false) => {
    const match = getMatch(matchId);
    if (!match) return null;

    const teamA = getTeam(match.teamAId);
    const teamB = getTeam(match.teamBId);
    const isCompleted = match.status === 'COMPLETED';
    const isLive = match.status === 'LIVE';
    const isArena1 = match.arena === 'Arena 1';

    const isWinnerA = isCompleted && match.winnerId === teamA?.id;
    const isWinnerB = isCompleted && match.winnerId === teamB?.id;

    const isHighlighted = activeLineage?.matchSet?.has(match.id);
    const isHovered = hoveredMatchId === match.id;

    // Next match text
    const nextText = customNextLabel || (match.nextMatchId ? `→ ${match.nextMatchId}` : null);

    return (
      <div 
        key={match.id}
        onMouseEnter={() => setHoveredMatchId(match.id)}
        onMouseLeave={() => setHoveredMatchId(null)}
        onClick={() => setActiveModalMatch(match)}
        style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          width: `${CARD_W}px`,
          height: `${CARD_H}px`
        }}
        className={`rounded bg-[#1a0711] border transition-all cursor-pointer relative shadow-sm select-none z-10 flex flex-col justify-between ${
          isLive 
            ? 'border-[#d99c26] ring-2 ring-[#d99c26] bg-[#290e1b] scale-[1.02]' 
            : isHovered
            ? 'border-[#f5b945] ring-1 ring-[#f5b945] bg-[#240a16] shadow-lg scale-[1.02]'
            : isHighlighted
            ? 'border-[#d99c26] bg-[#220a15] ring-1 ring-[#d99c26]/60'
            : isCompleted
            ? 'border-[#4a1626] hover:border-[#73233c]'
            : 'border-[#33101d] hover:border-[#52172d]'
        }`}
      >
        {/* Connection Port Indicators (Anchor dots) */}
        <div className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#12040b] transition-colors ${
          isHighlighted ? 'bg-[#f5b945]' : 'bg-[#4a1626]'
        }`} />
        <div className={`absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-[#12040b] transition-colors ${
          isHighlighted ? 'bg-[#f5b945]' : 'bg-[#4a1626]'
        }`} />

        {/* Card Header Bar */}
        <div className="flex items-center justify-between px-2 py-1 border-b border-[#290c17] text-[10px] font-mono leading-none">
          <div className="flex items-center gap-1.5 font-bold">
            <span className={isLive ? 'text-[#d99c26]' : 'text-white'}>
              {match.code}
            </span>
            <span className="text-[#a68f97] text-[9px] font-normal">
              {match.scheduledTime}
            </span>
            {nextText && (
              <span className="text-[#f5b945] text-[9px] font-extrabold bg-[#331407] px-1 py-0.2 rounded">
                {nextText}
              </span>
            )}
          </div>

          <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
            isArena1 
              ? 'bg-[#d99c26] text-[#1b1002]' 
              : 'bg-[#bd325e] text-white'
          }`}>
            {isArena1 ? 'A1' : 'A2'}
          </span>
        </div>

        {/* Team A Row */}
        <div className={`flex items-center justify-between px-2 py-1 text-xs transition-colors flex-1 ${
          isWinnerA ? 'bg-[#3d1808] text-[#f5b945] font-bold' : 'text-[#f4ede2]'
        }`}>
          <div className="truncate pr-1 text-[11px] font-medium leading-tight">
            {teamA ? (
              <span className="truncate">{teamA.name}</span>
            ) : match.sourceMatchA ? (
              <span className="text-[#8c747d] text-[10px] font-mono italic">↳ Win of {match.sourceMatchA}</span>
            ) : (
              <span className="text-[#8c747d] text-[10px] font-mono italic">BYE / TBD</span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {teamA && (
              <span className="text-[9px] text-[#8c747d] font-mono uppercase">
                {teamA.university.split(' ')[0]}
              </span>
            )}
            {isCompleted && (
              <span className={`font-mono font-bold text-[11px] px-1 rounded ${
                isWinnerA ? 'bg-[#f5b945] text-black' : 'bg-[#12050b] text-[#a68f97]'
              }`}>
                {match.scoreA}
              </span>
            )}
          </div>
        </div>

        {/* Team B Row */}
        <div className={`flex items-center justify-between px-2 py-1 text-xs border-t border-[#260c17] transition-colors flex-1 ${
          isWinnerB ? 'bg-[#3d1808] text-[#f5b945] font-bold' : 'text-[#f4ede2]'
        }`}>
          <div className="truncate pr-1 text-[11px] font-medium leading-tight">
            {teamB ? (
              <span className="truncate">{teamB.name}</span>
            ) : match.sourceMatchB ? (
              <span className="text-[#8c747d] text-[10px] font-mono italic">↳ Win of {match.sourceMatchB}</span>
            ) : (
              <span className="text-[#8c747d] text-[10px] font-mono italic">BYE / TBD</span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {teamB && (
              <span className="text-[9px] text-[#8c747d] font-mono uppercase">
                {teamB.university.split(' ')[0]}
              </span>
            )}
            {isCompleted && (
              <span className={`font-mono font-bold text-[11px] px-1 rounded ${
                isWinnerB ? 'bg-[#f5b945] text-black' : 'bg-[#12050b] text-[#a68f97]'
              }`}>
                {match.scoreB}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Direct Bye Pass Card for Play-In (Rows 2 & 7)
  const renderByeCard = (id, title, teamsText, targetMatch, left, top) => {
    const isTargetHighlighted = activeLineage?.matchSet?.has(targetMatch);
    return (
      <div 
        key={id}
        style={{
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          width: `${CARD_W}px`,
          height: `${CARD_H}px`
        }}
        className={`rounded border-2 border-dashed transition-all p-2 flex flex-col justify-between text-xs select-none ${
          isTargetHighlighted 
            ? 'border-[#d99c26] bg-[#220d18]' 
            : 'border-[#38101e] bg-[#12040b]/70 hover:border-[#57192f]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono uppercase font-black tracking-wider text-[#d99c26]">
            {title}
          </span>
          <span className="text-[9px] font-mono text-[#f5b945] font-bold">
            → {targetMatch}
          </span>
        </div>
        <div className="text-[11px] text-[#f4ede2] font-semibold leading-tight">
          {teamsText}
        </div>
        <div className="flex items-center justify-between text-[9px] font-mono text-[#8c747d]">
          <span>Skips Play-In</span>
          <span className="text-[#bd325e] font-bold">Arena 2</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-[#300e1b]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#d99c26] font-bold">
            <GitBranch className="w-3.5 h-3.5" />
            <span>SECTION 13 · INTERACTIVE KNOCKOUT SCHEMATIC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
            TOURNAMENT BRACKET & BRANCHES
          </h1>
          <p className="text-xs text-[#a68f97] mt-0.5">
            22 Teams · 22 Matches · 2 Arenas · Best-of-3 Sumo matches · Click or hover any match to trace branches
          </p>
        </div>

        {/* Legend & Stats */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-center">
          <div className="px-3 py-1.5 rounded bg-[#1a0711] border border-[#3b1222] min-w-[65px]">
            <div className="text-lg font-black text-white leading-none">22</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-0.5 font-semibold">Teams</div>
          </div>
          <div className="px-3 py-1.5 rounded bg-[#1a0711] border border-[#3b1222] min-w-[65px]">
            <div className="text-lg font-black text-white leading-none">22</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-0.5 font-semibold">Matches</div>
          </div>
          <div className="px-3 py-1.5 rounded bg-[#1a0711] border border-[#3b1222] min-w-[75px]">
            <div className="text-lg font-black text-[#d99c26] leading-none">10 Byes</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-0.5 font-semibold">Fast-Track</div>
          </div>
        </div>
      </div>

      {/* Branch Selection Toolbar & Quick Quarter Jump */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#14050d] border border-[#381020] text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase font-bold text-[#a68f97] flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#d99c26]" /> Branch Filter:
          </span>
          {[
            { id: 'ALL', label: 'All 22 Matches' },
            { id: 'Q1', label: 'Q1: Raiden · Defeat · RAID', arena: 'A1/A2' },
            { id: 'Q2', label: 'Q2: HTI · ZERO · Roxers · Nexus', arena: 'A1/A2' },
            { id: 'Q3', label: 'Q3: Wahy · Spark · Titan · الفرنجه', arena: 'A1/A2' },
            { id: 'Q4', label: 'Q4: Venom · Elite · Furious · هشيلك', arena: 'A1/A2' },
            { id: 'FINALS', label: 'Finals Track (M19, M20, M21, M22)', arena: 'Gold' }
          ].map(b => (
            <button
              key={b.id}
              onClick={() => setSelectedQuarter(b.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all font-semibold ${
                selectedQuarter === b.id
                  ? 'bg-[#d99c26] text-[#1b1002] font-black shadow-sm ring-1 ring-white/20'
                  : 'bg-[#1e0a13] text-[#f4ede2] hover:bg-[#2b0e1b] border border-[#38101e]'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Clear Highlight if active */}
        {(hoveredMatchId || selectedQuarter !== 'ALL') && (
          <button
            onClick={() => {
              setHoveredMatchId(null);
              setSelectedQuarter('ALL');
            }}
            className="text-[10px] font-mono text-[#f5b945] hover:underline"
          >
            Reset Focus
          </button>
        )}
      </div>

      {/* Active Lineage Breadcrumbs Bar */}
      {activeLineage && activeLineage.breadcrumbs.length > 0 && (
        <div className="px-3.5 py-2 rounded bg-[#240a17] border border-[#52172d] text-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono py-0.5">
            <span className="font-bold text-[#d99c26] uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Branch Lineage:
            </span>
            {activeLineage.breadcrumbs.map((m, idx) => (
              <React.Fragment key={m.id}>
                <span className={`px-2 py-0.5 rounded font-bold shrink-0 ${
                  m.id === hoveredMatchId 
                    ? 'bg-[#f5b945] text-black ring-1 ring-white' 
                    : 'bg-[#14050d] text-white border border-[#3b1222]'
                }`}>
                  {m.code} ({m.roundLabel}) · {m.scheduledTime}
                </span>
                {idx < activeLineage.breadcrumbs.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-[#d99c26] shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
          <span className="text-[10px] font-mono text-[#a68f97] shrink-0">
            {activeLineage.breadcrumbs.length} connected rounds
          </span>
        </div>
      )}

      {/* Horizontal Scrollable SVG Bracket Schematic */}
      <div className="p-4 sm:p-6 rounded-lg bg-[#0e0308] border border-[#381020] overflow-x-auto shadow-2xl relative select-none">
        
        {/* Schematic Canvas Container */}
        <div 
          style={{ 
            width: '1660px', 
            height: '980px',
            position: 'relative'
          }}
          className="bg-[#12040b]/40 rounded"
        >
          {/* Column Header Titles (Aligned to exact Col X positions) */}
          <div 
            style={{ position: 'absolute', left: `${getColX(0)}px`, top: '8px', width: `${CARD_W}px` }} 
            className="pb-2 border-b border-[#300e1b] text-left"
          >
            <span className="text-[9px] font-mono uppercase font-black text-[#d99c26] block">
              ROUND 1
            </span>
            <h2 className="text-xs font-black text-white tracking-wide">
              PLAY-IN
            </h2>
            <span className="text-[9px] font-mono text-[#8c747d]">
              6 matches · 15:30 – 16:20
            </span>
          </div>

          <div 
            style={{ position: 'absolute', left: `${getColX(1)}px`, top: '8px', width: `${CARD_W}px` }} 
            className="pb-2 border-b border-[#300e1b] text-left"
          >
            <span className="text-[9px] font-mono uppercase font-black text-[#d99c26] block">
              ROUND 2
            </span>
            <h2 className="text-xs font-black text-white tracking-wide">
              ROUND OF 16
            </h2>
            <span className="text-[9px] font-mono text-[#8c747d]">
              8 matches · 15:40 – 16:40
            </span>
          </div>

          <div 
            style={{ position: 'absolute', left: `${getColX(2)}px`, top: '8px', width: `${CARD_W}px` }} 
            className="pb-2 border-b border-[#300e1b] text-left"
          >
            <span className="text-[9px] font-mono uppercase font-black text-[#d99c26] block">
              ROUND 3
            </span>
            <h2 className="text-xs font-black text-white tracking-wide">
              QUARTER-FINALS
            </h2>
            <span className="text-[9px] font-mono text-[#8c747d]">
              4 matches · 16:40 – 17:00
            </span>
          </div>

          <div 
            style={{ position: 'absolute', left: `${getColX(3)}px`, top: '8px', width: `${CARD_W}px` }} 
            className="pb-2 border-b border-[#300e1b] text-left"
          >
            <span className="text-[9px] font-mono uppercase font-black text-[#d99c26] block">
              ROUND 4
            </span>
            <h2 className="text-xs font-black text-white tracking-wide">
              SEMI-FINALS
            </h2>
            <span className="text-[9px] font-mono text-[#8c747d]">
              2 matches · 17:00 – 17:10
            </span>
          </div>

          <div 
            style={{ position: 'absolute', left: `${getColX(4)}px`, top: '8px', width: `${CARD_W}px` }} 
            className="pb-2 border-b border-[#300e1b] text-left"
          >
            <span className="text-[9px] font-mono uppercase font-black text-[#d99c26] block">
              ROUND 5
            </span>
            <h2 className="text-xs font-black text-white tracking-wide">
              FINALS
            </h2>
            <span className="text-[9px] font-mono text-[#8c747d]">
              The Final & 3rd Place · 17:20
            </span>
          </div>

          <div 
            style={{ position: 'absolute', left: `${getColX(5)}px`, top: '8px', width: '250px`' }} 
            className="pb-2 border-b border-[#300e1b] text-left"
          >
            <span className="text-[9px] font-mono uppercase font-black text-[#d99c26] block">
              PODIUM & HONORS
            </span>
            <h2 className="text-xs font-black text-white tracking-wide">
              CHAMPIONSHIP
            </h2>
            <span className="text-[9px] font-mono text-[#8c747d]">
              1st, 2nd, 3rd & Special Prizes
            </span>
          </div>

          {/* SVG Connector Lines Canvas Layer */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{ width: '1660px', height: '980px' }}
          >
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d99c26" />
                <stop offset="100%" stopColor="#f5b945" />
              </linearGradient>
              <linearGradient id="roseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#bd325e" />
                <stop offset="100%" stopColor="#e84a7a" />
              </linearGradient>
            </defs>

            {connectors.map(c => {
              // Determine if this connector is highlighted
              let isHighlighted = false;
              if (activeLineage) {
                if (c.type === 'straight' || c.type === 'bypass' || c.type === 'champion') {
                  isHighlighted = activeLineage.matchSet.has(c.from) && activeLineage.matchSet.has(c.to);
                } else if (c.type === 'fork') {
                  isHighlighted = activeLineage.matchSet.has(c.to) && (activeLineage.matchSet.has(c.fromA) || activeLineage.matchSet.has(c.fromB));
                } else if (c.type === 'consolation') {
                  isHighlighted = activeLineage.matchSet.has(c.to);
                }
              }

              // Color choices
              const strokeColor = isHighlighted 
                ? '#f5b945' 
                : c.type === 'consolation'
                ? '#8c3552'
                : c.type === 'bypass'
                ? '#541c2c'
                : '#3b1220';

              const strokeWidth = isHighlighted ? 3 : 1.75;
              const dashArray = c.type === 'bypass' || c.type === 'consolation' ? '5,4' : 'none';

              if (c.type === 'straight' || c.type === 'bypass' || c.type === 'champion') {
                return (
                  <g key={c.id}>
                    <line
                      x1={c.x1}
                      y1={c.y1}
                      x2={c.x2}
                      y2={c.y2}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={dashArray}
                      strokeLinecap="round"
                      className="transition-all duration-200"
                    />
                    {isHighlighted && (
                      <circle cx={c.x2} cy={c.y2} r="3" fill="#f5b945" />
                    )}
                  </g>
                );
              }

              if (c.type === 'fork') {
                const xmid = (c.x1 + c.x2) / 2;
                const pathTop = `M ${c.x1} ${c.yA} H ${xmid} V ${c.yT} H ${c.x2}`;
                const pathBottom = `M ${c.x1} ${c.yB} H ${xmid} V ${c.yT} H ${c.x2}`;

                return (
                  <g key={c.id}>
                    <path
                      d={pathTop}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-200"
                    />
                    <path
                      d={pathBottom}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-200"
                    />
                    {isHighlighted && (
                      <circle cx={c.x2} cy={c.yT} r="3" fill="#f5b945" />
                    )}
                  </g>
                );
              }

              if (c.type === 'consolation') {
                const xmid = c.x1 + 18;
                const pathTop = `M ${c.x1} ${c.yA + 12} H ${xmid} V ${c.yT} H ${c.x2}`;
                const pathBottom = `M ${c.x1} ${c.yB - 12} H ${xmid} V ${c.yT} H ${c.x2}`;

                return (
                  <g key={c.id}>
                    <path
                      d={pathTop}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={1.5}
                      strokeDasharray="4,4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d={pathBottom}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={1.5}
                      strokeDasharray="4,4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              }

              return null;
            })}
          </svg>

          {/* COLUMN 0: ROUND 1 (PLAY-IN) MATCHES & BYPASS CARDS */}
          {renderCard('M09', getColX(0), getCardTop(rowCenters[0]), '→ M13')}
          {renderCard('M10', getColX(0), getCardTop(rowCenters[1]), '→ M14')}
          {renderByeCard('bye-q2', 'DIRECT SEED BYE', 'HTI Alsiddiq & ZERO', 'M04', getColX(0), getCardTop(rowCenters[2]))}
          {renderCard('M05', getColX(0), getCardTop(rowCenters[3]), '→ M11')}
          {renderCard('M01', getColX(0), getCardTop(rowCenters[4]), '→ M06')}
          {renderCard('M03', getColX(0), getCardTop(rowCenters[5]), '→ M12')}
          {renderCard('M02', getColX(0), getCardTop(rowCenters[6]), '→ M07')}
          {renderByeCard('bye-q4', 'DIRECT SEED BYE', 'FURIOUS & هشيلك من عالارض', 'M08', getColX(0), getCardTop(rowCenters[7]))}

          {/* COLUMN 1: ROUND 2 (ROUND OF 16) MATCHES */}
          {renderCard('M13', getColX(1), getCardTop(rowCenters[0]), '→ M17')}
          {renderCard('M14', getColX(1), getCardTop(rowCenters[1]), '→ M17')}
          {renderCard('M04', getColX(1), getCardTop(rowCenters[2]), '→ M15')}
          {renderCard('M11', getColX(1), getCardTop(rowCenters[3]), '→ M15')}
          {renderCard('M06', getColX(1), getCardTop(rowCenters[4]), '→ M16')}
          {renderCard('M12', getColX(1), getCardTop(rowCenters[5]), '→ M16')}
          {renderCard('M07', getColX(1), getCardTop(rowCenters[6]), '→ M18')}
          {renderCard('M08', getColX(1), getCardTop(rowCenters[7]), '→ M18')}

          {/* COLUMN 2: ROUND 3 (QUARTER-FINALS) MATCHES */}
          {renderCard('M17', getColX(2), getCardTop(qfCenters[0]), '→ M19 (SF1)')}
          {renderCard('M15', getColX(2), getCardTop(qfCenters[1]), '→ M19 (SF1)')}
          {renderCard('M16', getColX(2), getCardTop(qfCenters[2]), '→ M20 (SF2)')}
          {renderCard('M18', getColX(2), getCardTop(qfCenters[3]), '→ M20 (SF2)')}

          {/* COLUMN 3: ROUND 4 (SEMI-FINALS) MATCHES */}
          {renderCard('M19', getColX(3), getCardTop(sfCenters[0]), '→ M22 Final')}
          {renderCard('M20', getColX(3), getCardTop(sfCenters[1]), '→ M22 Final')}

          {/* COLUMN 4: ROUND 5 (THE FINAL & 3RD-PLACE MATCH) */}
          {renderCard('M22', getColX(4), getCardTop(finalCenter), '★ CHAMPION')}
          {renderCard('M21', getColX(4), getCardTop(thirdPlaceCenter), '🥉 3RD-PLACE')}

          {/* COLUMN 5: PODIUM & SPECIAL PRIZES (At getColX(5)) */}
          {/* 1ST PLACE CHAMPION PODIUM CARD */}
          <div 
            style={{
              position: 'absolute',
              left: `${getColX(5)}px`,
              top: `${getCardTop(finalCenter) - 24}px`,
              width: '250px'
            }}
            className="p-4 rounded-lg border-2 border-[#d99c26] bg-[#240e06] text-center shadow-2xl relative overflow-hidden z-10"
          >
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <Trophy className="w-32 h-32 text-[#d99c26]" />
            </div>

            <div className="flex justify-center mb-1">
              <div className="p-2 rounded-full bg-[#3b1705] border border-[#d99c26]/60">
                <Trophy className="w-6 h-6 text-[#d99c26]" />
              </div>
            </div>
            
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#d99c26] font-black">
              1ST PLACE · GRAND CHAMPION
            </div>
            
            <h3 className="text-lg font-black text-white mt-1 leading-snug">
              {championTeam ? championTeam.name : 'PENDING FINAL (M22)'}
            </h3>
            
            <p className="text-[11px] font-mono text-[#f5b945] mt-0.5 font-bold">
              {championTeam ? championTeam.university : 'Winner of M22 on Arena 1'}
            </p>

            <div className="mt-3 pt-2 border-t border-[#471d0a] flex items-center justify-between text-[10px] font-mono text-[#a68f97]">
              <span>IEEE RAS Champion</span>
              <span className="text-[#d99c26] font-bold">Gold Medal</span>
            </div>
          </div>

          {/* 3RD PLACE HONORS CARD */}
          <div 
            style={{
              position: 'absolute',
              left: `${getColX(5)}px`,
              top: `${getCardTop(thirdPlaceCenter)}px`,
              width: '250px'
            }}
            className="p-3 rounded-lg border border-[#bd325e]/60 bg-[#1e0a13] text-center shadow-lg relative z-10"
          >
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#bd325e] font-black">
              3RD PLACE HONORS
            </div>
            <div className="text-sm font-black text-white mt-0.5">
              {thirdPlaceTeam ? thirdPlaceTeam.name : 'Winner of M21'}
            </div>
            <div className="text-[10px] font-mono text-[#a68f97]">
              {thirdPlaceTeam ? thirdPlaceTeam.university : 'Decided on Arena 2'}
            </div>
          </div>

          {/* SPECIAL PRIZES SUMMARY CARD */}
          <div 
            style={{
              position: 'absolute',
              left: `${getColX(5)}px`,
              top: `${getCardTop(thirdPlaceCenter) + 84}px`,
              width: '250px'
            }}
            className="p-3 rounded-lg bg-[#14050d] border border-[#3b1222] text-xs font-mono space-y-2 z-10 shadow-md"
          >
            <div className="flex items-center justify-between pb-1 border-b border-[#2b0e1b]">
              <span className="font-bold text-white uppercase text-[10px]">Special Prizes (§14)</span>
              <span className="text-[#d99c26] font-bold text-[9px]">100 Pts Total</span>
            </div>
            <div className="space-y-1 text-[10px] text-[#f4ede2]">
              <div className="flex justify-between">
                <span className="text-[#a68f97]">Mechanical Design</span>
                <span className="font-bold text-[#d99c26]">25 pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a68f97]">Most Competitive</span>
                <span className="font-bold text-[#d99c26]">25 pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a68f97]">Engineering Innovation</span>
                <span className="font-bold text-[#d99c26]">25 pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a68f97]">Sportsmanship</span>
                <span className="font-bold text-[#d99c26]">25 pts</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Match Inspect Modal */}
      {activeModalMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-[#1a0812] border border-[#4a1626] p-5 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#2b0e1b]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-[#240a15] text-[#d99c26] px-2 py-0.5 rounded">
                  {activeModalMatch.code}
                </span>
                <span className="text-xs font-bold text-white">
                  {activeModalMatch.roundLabel}
                </span>
                <span className="text-xs text-[#a68f97] font-mono">
                  • {activeModalMatch.scheduledTime} ({activeModalMatch.arena})
                </span>
              </div>
              <button 
                onClick={() => setActiveModalMatch(null)} 
                className="text-[#a68f97] hover:text-white text-base leading-none"
              >
                ✕
              </button>
            </div>

            {/* Branch Progression Info */}
            <div className="p-2.5 rounded bg-[#10040a] border border-[#2b0e1b] text-xs font-mono space-y-1">
              <div className="flex items-center justify-between text-[#d99c26]">
                <span className="font-bold uppercase text-[10px]">Branch Target:</span>
                <span className="font-bold">
                  {activeModalMatch.nextMatchId ? `Advances to ${activeModalMatch.nextMatchId}` : 'Championship Title'}
                </span>
              </div>
              {activeModalMatch.sourceMatchA && (
                <div className="text-[10px] text-[#a68f97]">
                  Team A Source: Winner of {activeModalMatch.sourceMatchA}
                </div>
              )}
              {activeModalMatch.sourceMatchB && (
                <div className="text-[10px] text-[#a68f97]">
                  Team B Source: Winner of {activeModalMatch.sourceMatchB}
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded bg-[#10040a] border border-[#260c17] flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">
                    {getTeam(activeModalMatch.teamAId)?.name || 'TBD (Winner Pending)'}
                  </div>
                  <div className="text-[10px] text-[#8c747d]">
                    {getTeam(activeModalMatch.teamAId)?.university || '-'}
                  </div>
                </div>
                <span className="text-2xl font-mono font-black text-[#d99c26]">
                  {activeModalMatch.scoreA}
                </span>
              </div>

              <div className="p-3 rounded bg-[#10040a] border border-[#260c17] flex justify-between items-center">
                <div>
                  <div className="font-bold text-white text-sm">
                    {getTeam(activeModalMatch.teamBId)?.name || 'TBD (Winner Pending)'}
                  </div>
                  <div className="text-[10px] text-[#8c747d]">
                    {getTeam(activeModalMatch.teamBId)?.university || '-'}
                  </div>
                </div>
                <span className="text-2xl font-mono font-black text-[#bd325e]">
                  {activeModalMatch.scoreB}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#2b0e1b]">
              <span className="text-[10px] font-mono text-[#8c747d]">
                Best of 3 rounds · 2 wins to advance
              </span>
              <button
                onClick={() => {
                  onSelectMatchForJudging(activeModalMatch.id, activeModalMatch.arena);
                  setActiveModalMatch(null);
                }}
                className="px-4 py-2 rounded bg-[#d99c26] text-[#1b1002] font-black text-xs hover:bg-[#f5b945] transition-colors shadow-md"
              >
                Load into Referee Deck →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}