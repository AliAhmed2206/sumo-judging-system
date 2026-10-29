import React, { useState } from 'react';
import { 
  Clock, 
  Info,
  AlertCircle
} from 'lucide-react';
import { TOURNAMENT_METADATA } from '../data/initialData';

export default function ScheduleView({ 
  tournamentState, 
  onSelectMatchForJudging 
}) {
  const [filterArena, setFilterArena] = useState('ALL');

  const getTeam = (teamId) => tournamentState.teams.find(t => t.id === teamId);
  const getMatch = (matchId) => tournamentState.matches.find(m => m.id === matchId);

  // Exact 12 Slots from updated Section 8 graphic
  const slots = [
    { id: 'Slot 01', time: '15:30', ends: '15:40', m1: 'M01', m2: 'M02' },
    { id: 'Slot 02', time: '15:40', ends: '15:50', m1: 'M03', m2: 'M04' },
    { id: 'Slot 03', time: '15:50', ends: '16:00', m1: 'M05', m2: 'M06' },
    { id: 'Slot 04', time: '16:00', ends: '16:10', m1: 'M07', m2: 'M08' },
    { id: 'Slot 05', time: '16:10', ends: '16:20', m1: 'M09', m2: 'M10' },
    { id: 'Slot 06', time: '16:20', ends: '16:30', m1: 'M11', m2: 'M12' },
    { id: 'Slot 07', time: '16:30', ends: '16:40', m1: 'M13', m2: 'M14' },
    { id: 'Slot 08', time: '16:40', ends: '16:50', m1: 'M15', m2: 'M16' },
    { id: 'Slot 09', time: '16:50', ends: '17:00', m1: 'M17', m2: 'M18' },
    { id: 'Slot 10', time: '17:00', ends: '17:10', m1: 'M19', m2: 'M20', b2b: true },
    { id: 'Slot 11', time: '17:10', ends: '17:20', freeSlot: true },
    { id: 'Slot 12', time: '17:20', ends: '17:30', m1: 'M22', m2: 'M21' },
  ];

  const renderSlotMatch = (matchId, arenaName) => {
    if (!matchId) return null;
    const match = getMatch(matchId);
    if (!match) return null;

    const teamA = getTeam(match.teamAId);
    const teamB = getTeam(match.teamBId);
    const isCompleted = match.status === 'COMPLETED';
    const isLive = match.status === 'LIVE';
    const isArena1 = match.arena === 'Arena 1';

    return (
      <div 
        onClick={() => onSelectMatchForJudging(match.id, match.arena)}
        className={`p-3 rounded bg-[#1e0a13] border transition-all cursor-pointer flex items-center justify-between text-xs ${
          isLive
            ? 'border-[#d99c26] bg-[#290e1b] ring-1 ring-[#d99c26]'
            : isCompleted
            ? 'border-[#4a1626] hover:border-[#73233c]'
            : 'border-[#38101e] hover:border-[#57192f]'
        }`}
      >
        <div className="flex items-center gap-3 truncate">
          <div className="flex items-center gap-1 font-mono">
            <span className="font-bold text-[#d99c26]">{match.code}</span>
            <span className="text-[10px] text-[#8c747d] uppercase">{match.roundLabel}</span>
          </div>

          <div className="flex items-center gap-2 truncate font-medium">
            <span className={match.winnerId === teamA?.id ? 'text-[#f5b945] font-bold' : 'text-white'}>
              {teamA ? teamA.name : match.sourceMatchA ? `Winner of ${match.sourceMatchA}` : 'TBD'}
            </span>
            {teamA && <span className="text-[10px] text-[#8c747d] font-mono">{teamA.university.split(' ')[0]}</span>}

            <span className="text-[10px] text-[#d99c26] font-mono font-bold">vs</span>

            <span className={match.winnerId === teamB?.id ? 'text-[#f5b945] font-bold' : 'text-white'}>
              {teamB ? teamB.name : match.sourceMatchB ? `Winner of ${match.sourceMatchB}` : 'TBD'}
            </span>
            {teamB && <span className="text-[10px] text-[#8c747d] font-mono">{teamB.university.split(' ')[0]}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {match.isB2B && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#14050a] text-[#d99c26] border border-[#d99c26]/40">
              B2B
            </span>
          )}
          {isCompleted ? (
            <span className="font-mono font-bold text-xs bg-[#10040a] px-2 py-0.5 rounded text-[#d99c26] border border-[#3b1222]">
              {match.scoreA} : {match.scoreB}
            </span>
          ) : isLive ? (
            <span className="font-mono font-bold text-[10px] bg-[#d99c26] text-black px-1.5 py-0.5 rounded">
              RING
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Poster Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#300e1b]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#d99c26] font-bold">
            <span>SECTION 8 · MATCH PROCEDURE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-0.5">
            MATCH SCHEDULE
          </h1>
          <p className="text-xs text-[#a68f97] mt-1">
            2 arenas · 12 slots of 10 minutes · 15:30 – 17:30 · buffer held until 18:00
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-center">
          <div className="px-3.5 py-2 rounded bg-[#1e0a13] border border-[#3b1222] min-w-[75px]">
            <div className="text-xl font-black text-white leading-none">120</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-1 font-semibold">Min Planned</div>
          </div>
          <div className="px-3.5 py-2 rounded bg-[#1e0a13] border border-[#3b1222] min-w-[75px]">
            <div className="text-xl font-black text-[#d99c26] leading-none">30</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-1 font-semibold">Min Buffer</div>
          </div>
          <div className="px-3.5 py-2 rounded bg-[#1e0a13] border border-[#3b1222] min-w-[75px]">
            <div className="text-xl font-black text-white leading-none">11</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-1 font-semibold">Arena 1 Matches</div>
          </div>
          <div className="px-3.5 py-2 rounded bg-[#1e0a13] border border-[#3b1222] min-w-[75px]">
            <div className="text-xl font-black text-white leading-none">11</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-1 font-semibold">Arena 2 Matches</div>
          </div>
        </div>
      </div>

      {/* Legend & B2B Badge Callout */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#a68f97]">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14050a] text-[#d99c26] border border-[#d99c26]/40">
            B2B
          </span>
          <span className="text-[11px]">one of the two teams plays in the slot straight after its previous match</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#d99c26]" />
            <span className="font-bold text-white">ARENA 1 (Main Arena · Hosts the Final)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#bd325e]" />
            <span className="font-bold text-white">ARENA 2 (Hosts 3rd-Place Match)</span>
          </div>
        </div>
      </div>

      {/* Timetable Slot Rows (Exact recreation of Poster 2) */}
      <div className="space-y-2.5">
        {slots.map((slot) => (
          <div 
            key={slot.id}
            className="p-2.5 rounded bg-[#14050d] border border-[#300e1b] flex flex-col md:flex-row items-stretch md:items-center gap-3"
          >
            {/* Time Slot Column */}
            <div className="w-full md:w-36 shrink-0 font-mono text-left p-1">
              <div className="text-lg font-black text-white">{slot.time}</div>
              <div className="text-[10px] text-[#8c747d] uppercase">{slot.id} · ends {slot.ends}</div>
            </div>

            {/* Arena 1 Slot */}
            <div className="flex-1">
              {slot.freeSlot ? (
                <div className="h-full flex items-center justify-center p-3 rounded border border-dashed border-[#3a1322] bg-[#0c0306] text-[11px] font-mono text-[#8c747d] uppercase tracking-wider">
                  ARENA FREE THIS SLOT
                </div>
              ) : (
                renderSlotMatch(slot.m1, 'Arena 1')
              )}
            </div>

            {/* Arena 2 Slot */}
            <div className="flex-1">
              {slot.freeSlot ? (
                <div className="h-full flex items-center justify-center p-3 rounded border border-dashed border-[#3a1322] bg-[#0c0306] text-[11px] font-mono text-[#8c747d] uppercase tracking-wider">
                  ARENA FREE THIS SLOT
                </div>
              ) : (
                renderSlotMatch(slot.m2, 'Arena 2')
              )}
            </div>
          </div>
        ))}

        {/* 17:30 TO 18:00 · 30-MINUTE BUFFER (Hatched Bar exactly matching Poster 2) */}
        <div className="p-4 rounded border border-[#d99c26]/60 bg-buffer-stripes shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-3">
            <div className="font-mono text-lg font-black text-[#f5b945]">17:30 TO 18:00</div>
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div>
              <div className="font-bold text-xs uppercase tracking-wide">30-MINUTE BUFFER</div>
              <div className="text-[11px] text-[#f4ede2]/80">Held for overruns, restarts, bottle tiebreakers and the prize ceremony.</div>
            </div>
          </div>
          <span className="font-mono text-[10px] font-bold text-[#d99c26] uppercase px-2 py-0.5 rounded bg-[#100408] border border-[#d99c26]/40">
            OFFICIAL BUFFER
          </span>
        </div>
      </div>

      {/* 3 Bottom Callout Panels (Exact text from Poster 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded bg-[#16060e] border border-[#300e1b] text-xs space-y-1.5">
          <div className="font-mono font-bold text-[#d99c26] uppercase tracking-wider text-[11px]">
            TIMING
          </div>
          <p className="text-[#a68f97] text-[11px] leading-relaxed">
            A match is best of 3 rounds: up to 2 minutes per round and up to 1 minute between rounds, so at most 8 minutes of play. The 10-minute slot leaves about 2 minutes to clear and place the next pair. A bottle tiebreaker or a restart eats into that.
          </p>
        </div>

        <div className="p-4 rounded bg-[#16060e] border border-[#300e1b] text-xs space-y-1.5">
          <div className="font-mono font-bold text-[#d99c26] uppercase tracking-wider text-[11px]">
            REST BETWEEN MATCHES
          </div>
          <p className="text-[#a68f97] text-[11px] leading-relaxed">
            Every team gets at least one empty slot (10 min) between matches, except two quarter-final to semi-final links: M17 → M19 and M18 → M20. Removing those as well would need a 13th slot and a 17:40 finish. The empty 17:10 slot gives all four semi-finalists a 10-minute rest before the Final and 3rd-place match.
          </p>
        </div>

        <div className="p-4 rounded bg-[#16060e] border border-[#300e1b] text-xs space-y-1.5">
          <div className="font-mono font-bold text-[#d99c26] uppercase tracking-wider text-[11px]">
            IF A SLOT RUNS LATE
          </div>
          <p className="text-[#a68f97] text-[11px] leading-relaxed">
            The empty 17:10 slot and the 30-minute buffer absorb overruns. Later matches shift on the affected arena only, as long as the next match there does not need the late winner. A team that is not ready within 5 minutes of being called loses the match (§3.2).
          </p>
        </div>
      </div>
    </div>
  );
}
