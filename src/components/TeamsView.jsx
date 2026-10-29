import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Edit3, 
  Filter
} from 'lucide-react';
import { UNIVERSITIES } from '../data/initialData';

export default function TeamsView({ tournamentState, onUpdateTeam }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('ALL');
  const [editingTeam, setEditingTeam] = useState(null);

  const filteredTeams = tournamentState.teams.filter(team => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      team.name.toLowerCase().includes(term) ||
      (team.nameEn && team.nameEn.toLowerCase().includes(term)) ||
      team.id.toLowerCase().includes(term) ||
      team.university.toLowerCase().includes(term) ||
      team.firstMatch?.toLowerCase().includes(term);

    const matchesUni = selectedUniversity === 'ALL' || team.university.toLowerCase().includes(selectedUniversity.toLowerCase());
    return matchesSearch && matchesUni;
  });

  const handleSaveTeamEdit = (e) => {
    e.preventDefault();
    if (editingTeam) {
      onUpdateTeam(editingTeam);
      setEditingTeam(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Poster Style Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#300e1b]">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#d99c26] font-bold">
            <span>SECTION 3 · TEAMS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-0.5">
            TEAMS & DRAW
          </h1>
          <p className="text-xs text-[#a68f97] mt-1">
            Random draw · no two teams from the same university can meet before the quarter-finals
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-center">
          <div className="px-3.5 py-2 rounded bg-[#1e0a13] border border-[#3b1222] min-w-[75px]">
            <div className="text-xl font-black text-white leading-none">22</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-1 font-semibold">Teams</div>
          </div>
          <div className="px-3.5 py-2 rounded bg-[#1e0a13] border border-[#3b1222] min-w-[75px]">
            <div className="text-xl font-black text-white leading-none">99+</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-1 font-semibold">Participants</div>
          </div>
          <div className="px-3.5 py-2 rounded bg-[#1e0a13] border border-[#3b1222] min-w-[75px]">
            <div className="text-xl font-black text-[#d99c26] leading-none">12</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-1 font-semibold">Play-In Teams</div>
          </div>
          <div className="px-3.5 py-2 rounded bg-[#1e0a13] border border-[#3b1222] min-w-[75px]">
            <div className="text-xl font-black text-[#f5b945] leading-none">10</div>
            <div className="text-[9px] uppercase tracking-wider text-[#a68f97] mt-1 font-semibold">Byes to R16</div>
          </div>
        </div>
      </div>

      {/* Teams by University Horizontal Strip (Exact Match with Poster 3) */}
      <div className="p-3 rounded bg-[#14050d] border border-[#300e1b] space-y-2 font-mono">
        <div className="text-[10px] uppercase font-bold text-[#a68f97]">
          TEAMS BY UNIVERSITY
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {UNIVERSITIES.map(u => (
            <button
              key={u.id}
              onClick={() => setSelectedUniversity(selectedUniversity === u.id ? 'ALL' : u.id)}
              className={`px-3 py-1.5 rounded transition-colors flex items-center gap-2 border ${
                selectedUniversity === u.id
                  ? 'bg-[#d99c26] text-[#1b1002] border-[#d99c26] font-bold'
                  : 'bg-[#1e0a13] text-white border-[#38101e] hover:border-[#57192f]'
              }`}
            >
              <span>{u.id}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                selectedUniversity === u.id ? 'bg-[#1b1002] text-[#d99c26]' : 'bg-[#100409] text-[#d99c26]'
              }`}>
                {u.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#8c747d]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by Team Name, ID, University or First Match..."
          className="w-full pl-10 pr-4 py-2.5 rounded bg-[#16060e] border border-[#381020] text-xs text-white placeholder-[#8c747d] focus:outline-none focus:border-[#d99c26]"
        />
      </div>

      {/* Main Table (Exact Match with Poster 3) */}
      <div className="rounded border border-[#300e1b] bg-[#14050d] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2b0f19] bg-[#1a0812] font-mono text-[10px] uppercase tracking-wider text-[#a68f97]">
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">TEAM</th>
                <th className="py-2.5 px-3">UNIVERSITY / CHAPTER</th>
                <th className="py-2.5 px-3 text-center">MEMBERS</th>
                <th className="py-2.5 px-3 text-center">ENTRY</th>
                <th className="py-2.5 px-3">FIRST MATCH</th>
                <th className="py-2.5 px-3 text-right">BRACKET QUARTER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#200712] font-mono text-xs">
              {filteredTeams.map((team) => {
                const isPlayIn = team.entry === 'PLAY-IN';
                const isArena1 = team.firstMatch?.includes('ARENA 1') || team.firstMatch?.includes('M01') || team.firstMatch?.includes('M03') || team.firstMatch?.includes('M05') || team.firstMatch?.includes('M07') || team.firstMatch?.includes('M09') || team.firstMatch?.includes('M11') || team.firstMatch?.includes('M13');

                return (
                  <tr key={team.id} className="hover:bg-[#1f0b14] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#8c747d]">
                      {team.id === 'T-0023' ? 'New' : team.id}
                    </td>

                    <td className="py-2.5 px-3 font-sans font-bold text-white">
                      <div>{team.name}</div>
                      {team.nameEn && <div className="text-[10px] font-normal text-[#a68f97]">{team.nameEn}</div>}
                    </td>

                    <td className="py-2.5 px-3 font-sans text-[#a68f97]">
                      {team.university}
                    </td>

                    <td className="py-2.5 px-3 text-center text-white">
                      {team.id === 'T-0023' ? '—' : team.members}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        isPlayIn 
                          ? 'bg-[#2b0c16] text-[#f5b945] border border-[#d99c26]/40' 
                          : 'bg-[#180811] text-[#a68f97] border border-[#3b1222]'
                      }`}>
                        {team.entry}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{team.firstMatch}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-extrabold uppercase ${
                          isArena1 ? 'bg-[#d99c26] text-[#1b1002]' : 'bg-[#bd325e] text-white'
                        }`}>
                          {isArena1 ? 'ARENA 1' : 'ARENA 2'}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-right text-[#a68f97] text-[11px]">
                      {team.bracketQuarter}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[10px] font-mono text-[#8c747d] text-center pt-2">
        Source: registration sheet (T-0002 to T-0022) plus Robotronics, registered afterwards · its university and size are still to be confirmed · participants exclude Robotronics
      </div>
    </div>
  );
}
