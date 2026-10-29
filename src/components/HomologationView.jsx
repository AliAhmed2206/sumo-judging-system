import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Check, 
  AlertTriangle,
  RotateCcw,
  Scale,
  ShieldCheck,
  Undo2
} from 'lucide-react';

export default function HomologationView({ 
  tournamentState, 
  onUpdateTeam, 
  onUndo, 
  canUndo 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PASSED, PENDING, FAILED

  const filteredTeams = tournamentState.teams.filter(t => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      t.name.toLowerCase().includes(term) ||
      t.id.toLowerCase().includes(term) ||
      String(t.robotNumber).includes(term) ||
      t.robotName?.toLowerCase().includes(term) ||
      t.university.toLowerCase().includes(term);

    const homStatus = t.homologation?.status || 'PENDING';
    const matchesStatus = statusFilter === 'ALL' || homStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const passedCount = tournamentState.teams.filter(t => t.homologation?.status === 'PASSED').length;
  const pendingCount = tournamentState.teams.filter(t => (t.homologation?.status || 'PENDING') === 'PENDING').length;
  const failedCount = tournamentState.teams.filter(t => t.homologation?.status === 'FAILED' || t.homologation?.status === 'RE-INSPECTION').length;

  // Live Inline Update Handler
  const handleLiveFieldUpdate = (team, field, value) => {
    const currentHomologation = team.homologation || {
      status: 'PENDING',
      massChecked: true,
      dimensionsChecked: true,
      emergencyStopTested: true,
      batteryInspected: true,
      a4PaperTractionPassed: true,
      durabilityCheckPassed: true,
      numberDisplayed: true
    };

    let updatedTeam = { ...team };

    if (field === 'weightGrams') {
      const mass = parseInt(value) || 0;
      updatedTeam.weightGrams = mass;
      updatedTeam.homologation = {
        ...currentHomologation,
        massChecked: mass <= 3000,
        status: mass > 3000 ? 'RE-INSPECTION' : currentHomologation.status
      };
    } else if (field === 'controlMode') {
      updatedTeam.controlMode = value;
    } else if (field === 'dimensionsCm') {
      updatedTeam.dimensionsCm = value;
    } else if (field === 'status') {
      updatedTeam.homologation = {
        ...currentHomologation,
        status: value
      };
    } else {
      // Boolean toggle in homologation
      updatedTeam.homologation = {
        ...currentHomologation,
        [field]: value
      };
    }

    onUpdateTeam(updatedTeam, `Homologation: ${team.name} updated ${field}`);
  };

  const handleQuickPassAll = () => {
    if (window.confirm('Pass all pending robots that meet mass limits (<= 3000g)?')) {
      tournamentState.teams.forEach(t => {
        if (t.weightGrams <= 3000 && t.homologation?.status !== 'PASSED') {
          handleLiveFieldUpdate(t, 'status', 'PASSED');
        }
      });
    }
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded bg-[#14050d] border border-[#2d0e1b]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold text-[#d99c26]">Handbook §7</span>
            <span className="text-xs text-white font-bold tracking-tight">Technical Inspection (Homologation) Register</span>
          </div>
          <p className="text-[11px] text-[#a68f97] mt-0.5">
            Click any field or toggle to edit live. Every inspection change updates immediately and can be undone.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          {canUndo && (
            <button
              onClick={onUndo}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#200913] text-[#d99c26] border border-[#3b1222] font-mono text-[11px] font-bold hover:bg-[#2e0e1d]"
              title="Undo last edit (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>
          )}

          <div className="px-2.5 py-1 rounded bg-[#100409] border border-emerald-900/60 text-emerald-400">
            <span className="text-[10px] text-gray-500 mr-1">PASSED:</span>
            <span className="font-bold">{passedCount}</span>/22
          </div>
          <div className="px-2.5 py-1 rounded bg-[#100409] border border-amber-900/60 text-[#d99c26]">
            <span className="text-[10px] text-gray-500 mr-1">PENDING:</span>
            <span className="font-bold">{pendingCount}</span>
          </div>
          {failedCount > 0 && (
            <div className="px-2.5 py-1 rounded bg-[#100409] border border-rose-900/60 text-rose-400">
              <span className="text-[10px] text-gray-500 mr-1">RE-CHECK:</span>
              <span className="font-bold">{failedCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by robot #, team name, university, or ID..."
            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#120509] border border-[#2d0e1b] text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#d99c26]"
          />
        </div>

        <div className="flex items-center gap-1 font-mono text-xs">
          {['ALL', 'PASSED', 'PENDING', 'RE-INSPECTION'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                statusFilter === st 
                  ? 'bg-[#d99c26] text-black border-[#d99c26]' 
                  : 'bg-[#14050d] text-gray-400 border-[#2d0e1b]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Live Editable Table */}
      <div className="rounded border border-[#2d0e1b] bg-[#14050d] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-[#240a15] bg-[#1a0812] text-[#a68f97] text-[10px] uppercase tracking-wider">
                <th className="py-2 px-2.5">No.</th>
                <th className="py-2 px-2.5 font-sans">Team</th>
                <th className="py-2 px-2.5">Mass (g) [&le;3000g §4]</th>
                <th className="py-2 px-2.5">Envelope (cm §4)</th>
                <th className="py-2 px-2.5 text-center">Dual E-Stop (§4)</th>
                <th className="py-2 px-2.5 text-center">A4 Paper Test (§5.2)</th>
                <th className="py-2 px-2.5 text-center">Durability Contact (§7)</th>
                <th className="py-2 px-2.5">Control Mode (§4)</th>
                <th className="py-2 px-2.5 text-right">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e0a13] text-xs">
              {filteredTeams.map((team) => {
                const hom = team.homologation || {};
                const isOverweight = team.weightGrams > 3000;
                const isPassed = hom.status === 'PASSED';
                const isFailed = hom.status === 'FAILED' || hom.status === 'RE-INSPECTION';

                return (
                  <tr key={team.id} className="hover:bg-[#1a0812]/50 transition-colors">
                    {/* Robot Number */}
                    <td className="py-2 px-2.5 font-bold text-[#d99c26]">
                      #{team.robotNumber}
                    </td>

                    {/* Team Name */}
                    <td className="py-2 px-2.5 font-sans font-medium text-white truncate max-w-[150px]">
                      <div>{team.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono truncate">{team.university}</div>
                    </td>

                    {/* Live Mass Input */}
                    <td className="py-2 px-2.5">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={team.weightGrams}
                          onChange={(e) => handleLiveFieldUpdate(team, 'weightGrams', e.target.value)}
                          className={`w-16 px-1.5 py-0.5 rounded text-xs font-bold text-center border focus:outline-none ${
                            isOverweight 
                              ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse' 
                              : 'bg-[#0a0205] text-emerald-400 border-[#2d0e1b] focus:border-[#d99c26]'
                          }`}
                        />
                        <span className="text-[10px] text-gray-500">g</span>
                      </div>
                    </td>

                    {/* Live Dimensions Envelope Input */}
                    <td className="py-2 px-2.5">
                      <input
                        type="text"
                        value={team.dimensionsCm || '20.0 x 20.0'}
                        onChange={(e) => handleLiveFieldUpdate(team, 'dimensionsCm', e.target.value)}
                        className="w-24 px-1.5 py-0.5 rounded bg-[#0a0205] border border-[#2d0e1b] text-gray-300 text-xs text-center focus:outline-none focus:border-[#d99c26]"
                      />
                    </td>

                    {/* 2 E-Stops Toggle (1-click live toggle) */}
                    <td className="py-2 px-2.5 text-center">
                      <button
                        onClick={() => handleLiveFieldUpdate(team, 'emergencyStopTested', !hom.emergencyStopTested)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          hom.emergencyStopTested
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-rose-950/60 text-rose-300 border-rose-800'
                        }`}
                        title="Click to toggle pass/fail for Dual Kill Switches (§4)"
                      >
                        {hom.emergencyStopTested ? 'PASS (2/2)' : 'FAIL'}
                      </button>
                    </td>

                    {/* A4 Paper Traction Test Toggle */}
                    <td className="py-2 px-2.5 text-center">
                      <button
                        onClick={() => handleLiveFieldUpdate(team, 'a4PaperTractionPassed', !hom.a4PaperTractionPassed)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          hom.a4PaperTractionPassed
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-rose-950/60 text-rose-300 border-rose-800'
                        }`}
                        title="Click to toggle A4 paper traction test (<2s hold §5.2)"
                      >
                        {hom.a4PaperTractionPassed ? 'PASS' : 'FAIL'}
                      </button>
                    </td>

                    {/* Durability Contact Test Toggle */}
                    <td className="py-2 px-2.5 text-center">
                      <button
                        onClick={() => handleLiveFieldUpdate(team, 'durabilityCheckPassed', !hom.durabilityCheckPassed)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                          hom.durabilityCheckPassed
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                            : 'bg-rose-950/60 text-rose-300 border-rose-800'
                        }`}
                        title="Click to toggle durability contact test (§7)"
                      >
                        {hom.durabilityCheckPassed ? 'PASS' : 'FAIL'}
                      </button>
                    </td>

                    {/* Live Control Mode Dropdown */}
                    <td className="py-2 px-2.5">
                      <select
                        value={team.controlMode || 'Autonomous'}
                        onChange={(e) => handleLiveFieldUpdate(team, 'controlMode', e.target.value)}
                        className="bg-[#0a0205] text-white border border-[#2d0e1b] rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-[#d99c26]"
                      >
                        <option value="Autonomous">Autonomous</option>
                        <option value="Manual (Wireless)">Manual (Wireless)</option>
                      </select>
                    </td>

                    {/* Live Overall Status Dropdown */}
                    <td className="py-2 px-2.5 text-right">
                      <select
                        value={hom.status || 'PENDING'}
                        onChange={(e) => handleLiveFieldUpdate(team, 'status', e.target.value)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border focus:outline-none ${
                          isPassed
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : isFailed
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-amber-950 text-[#d99c26] border-amber-800'
                        }`}
                      >
                        <option value="PASSED">PASSED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="RE-INSPECTION">RE-INSPECTION</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
