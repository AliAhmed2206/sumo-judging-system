import React, { useState } from 'react';
import { 
  Award, 
  Wrench, 
  Swords, 
  Lightbulb, 
  HeartHandshake, 
  Trophy, 
  Check, 
  FileText,
  UserCheck,
  Printer
} from 'lucide-react';
import { SPECIAL_PRIZES, DEFAULT_JUDGES } from '../data/initialData';

export default function SpecialPrizesView({ 
  tournamentState, 
  onSavePrizeScore 
}) {
  const [selectedJudgeId, setSelectedJudgeId] = useState('J1');
  const [selectedTeamId, setSelectedTeamId] = useState(tournamentState.teams[0]?.id || '');
  const [scores, setScores] = useState({
    'SP-1': 20, // Best Mechanical Design
    'SP-2': 20, // Most Competitive Robot
    'SP-3': 20, // Best Engineering Innovation
    'SP-4': 25  // Sportsmanship Award
  });
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const getTeam = (teamId) => tournamentState.teams.find(t => t.id === teamId);
  const prizeEvaluations = tournamentState.prizeEvaluations || {};

  const handleScoreChange = (prizeId, val) => {
    setScores(prev => ({
      ...prev,
      [prizeId]: Math.min(25, Math.max(0, parseInt(val) || 0))
    }));
  };

  const handleSaveEvaluation = (e) => {
    e.preventDefault();
    onSavePrizeScore(selectedTeamId, selectedJudgeId, scores, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Calculate official standings per Handbook §14
  // Each judge fills out 100 pts. Designated official calculates average of the 3 judges' points.
  const teamStandings = tournamentState.teams.map(team => {
    let judgeTotals = [];
    let criteriaSums = { 'SP-1': 0, 'SP-2': 0, 'SP-3': 0, 'SP-4': 0 };
    let judgesCount = 0;

    DEFAULT_JUDGES.forEach(j => {
      const entry = prizeEvaluations[`${team.id}_${j.id}`];
      if (entry) {
        const total = (entry['SP-1'] || 0) + (entry['SP-2'] || 0) + (entry['SP-3'] || 0) + (entry['SP-4'] || 0);
        judgeTotals.push(total);
        criteriaSums['SP-1'] += entry['SP-1'] || 0;
        criteriaSums['SP-2'] += entry['SP-2'] || 0;
        criteriaSums['SP-3'] += entry['SP-3'] || 0;
        criteriaSums['SP-4'] += entry['SP-4'] || 0;
        judgesCount += 1;
      } else {
        judgeTotals.push(null);
      }
    });

    const evaluatedJudges = judgeTotals.filter(t => t !== null);
    const overallAverage = evaluatedJudges.length > 0 
      ? (evaluatedJudges.reduce((a, b) => a + b, 0) / evaluatedJudges.length).toFixed(1)
      : '0.0';

    return {
      team,
      judgeTotals,
      evaluatedJudgesCount: evaluatedJudges.length,
      overallAverage: parseFloat(overallAverage),
      mechAvg: judgesCount > 0 ? (criteriaSums['SP-1'] / judgesCount).toFixed(1) : '0.0',
      compAvg: judgesCount > 0 ? (criteriaSums['SP-2'] / judgesCount).toFixed(1) : '0.0',
      innovAvg: judgesCount > 0 ? (criteriaSums['SP-3'] / judgesCount).toFixed(1) : '0.0',
      sportsAvg: judgesCount > 0 ? (criteriaSums['SP-4'] / judgesCount).toFixed(1) : '0.0',
    };
  }).sort((a, b) => b.overallAverage - a.overallAverage);

  const topOverall = teamStandings[0];

  return (
    <div className="space-y-5 pb-16">
      {/* Handbook Header */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#14060d] border border-[#2b0f19] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#c5a059] bg-[#220a13] px-2 py-0.5 rounded border border-[#c5a059]/30">
              Handbook Section 14
            </span>
            <span className="text-xs text-gray-400">Technical & Performance Prizes (100 Points Total)</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Special Prize Evaluation & Multi-Judge Scoring Sheet
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Three independent judges evaluate all 22 teams across 4 criteria (25 pts each). Official arithmetic mean determines winners.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1f0b14] border border-[#3b1222] text-[#c5a059] text-xs font-mono font-semibold hover:bg-[#2b0f1b]"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Scoring Ledger</span>
        </button>
      </div>

      {/* Main Scoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Judge Score Input Sheet */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-[#120509] border border-[#2b0f19] space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#240a15]">
            <span className="text-xs font-mono font-bold uppercase text-white">
              Judge Ballot Entry
            </span>
            <div className="flex items-center gap-1">
              {DEFAULT_JUDGES.map(j => (
                <button
                  key={j.id}
                  onClick={() => setSelectedJudgeId(j.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                    selectedJudgeId === j.id
                      ? 'bg-[#c5a059] text-black'
                      : 'bg-[#18060f] text-gray-400 hover:text-white border border-[#2b0f19]'
                  }`}
                >
                  {j.id}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveEvaluation} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-gray-400 font-mono text-[11px] mb-1">
                Candidate Team:
              </label>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full bg-[#0a0205] text-white border border-[#2b0f19] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#c5a059]"
              >
                {tournamentState.teams.map(t => (
                  <option key={t.id} value={t.id}>
                    #{t.robotNumber} • {t.name} ({t.university})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Team Info Strip */}
            {getTeam(selectedTeamId) && (
              <div className="p-2.5 rounded bg-[#0e0409] border border-[#240a15] text-[11px] font-mono flex justify-between items-center text-gray-300">
                <div>
                  <div className="font-bold text-white">{getTeam(selectedTeamId)?.name}</div>
                  <div className="text-gray-500">{getTeam(selectedTeamId)?.university}</div>
                </div>
                <div className="text-right text-gray-400">
                  <div>Robot: <span className="text-[#c5a059]">{getTeam(selectedTeamId)?.robotName}</span></div>
                  <div>Mass: {getTeam(selectedTeamId)?.weightGrams}g</div>
                </div>
              </div>
            )}

            {/* 4 Handbook Criteria */}
            <div className="space-y-2.5 pt-1">
              {SPECIAL_PRIZES.map((prize) => (
                <div key={prize.id} className="p-2.5 rounded bg-[#0a0205] border border-[#200712] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{prize.title}</div>
                      <div className="text-[10px] text-gray-400 leading-tight pr-2">
                        {prize.rubric}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={scores[prize.id] ?? 20}
                        onChange={(e) => handleScoreChange(prize.id, e.target.value)}
                        className="w-12 text-center py-1 rounded bg-[#18060f] border border-[#3b1222] text-[#c5a059] font-bold text-xs"
                      />
                      <span className="text-gray-500 text-[10px]">/25</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Deliberation Notes */}
            <div>
              <label className="block text-gray-400 font-mono text-[11px] mb-1">
                Judge Remarks / Evidence (§14):
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Technical rationale (e.g. blade wedge tolerance, recovery from flips, sporting conduct)..."
                rows="2"
                className="w-full px-3 py-1.5 rounded bg-[#0a0205] border border-[#2b0f19] text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            {/* Save Score */}
            <div className="flex items-center justify-between pt-2 border-t border-[#240a15]">
              <span className="text-xs font-mono text-gray-300">
                Ballot Total:{' '}
                <strong className="text-[#c5a059] text-sm">
                  {Object.values(scores).reduce((a, b) => a + b, 0)}
                </strong>
                /100
              </span>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#c5a059] text-black font-bold text-xs hover:bg-[#d8b46e] transition-colors"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-black" /> : <Award className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Ballot Saved' : 'Submit Judge Ballot'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Official 22-Team Grand Standings Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#c5a059]" />
              <span>Official Standings Ledger (Calculated Arithmetic Mean)</span>
            </span>
            <span className="text-[11px] font-mono text-gray-500">§14 Designated Official Formula</span>
          </div>

          <div className="rounded-lg border border-[#2b0f19] bg-[#120509] overflow-hidden">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-[#17060e] border-b border-[#240a15] text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-2.5">Rank</th>
                    <th className="py-2 px-2.5">Team</th>
                    <th className="py-2 px-2 text-center">J1</th>
                    <th className="py-2 px-2 text-center">J2</th>
                    <th className="py-2 px-2 text-center">J3</th>
                    <th className="py-2 px-2.5 text-right font-bold text-[#c5a059]">Official Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b0811] font-mono text-xs">
                  {teamStandings.map((item, idx) => (
                    <tr key={item.team.id} className="hover:bg-[#1a0812]/50">
                      <td className="py-2 px-2.5 text-gray-400 font-bold">
                        #{idx + 1}
                      </td>

                      <td className="py-2 px-2.5 font-sans">
                        <div className="font-semibold text-white truncate max-w-[170px]">{item.team.name}</div>
                        <div className="text-[10px] text-gray-500 truncate">{item.team.university}</div>
                      </td>

                      <td className="py-2 px-2 text-center text-gray-400">
                        {item.judgeTotals[0] !== null ? item.judgeTotals[0] : '—'}
                      </td>

                      <td className="py-2 px-2 text-center text-gray-400">
                        {item.judgeTotals[1] !== null ? item.judgeTotals[1] : '—'}
                      </td>

                      <td className="py-2 px-2 text-center text-gray-400">
                        {item.judgeTotals[2] !== null ? item.judgeTotals[2] : '—'}
                      </td>

                      <td className="py-2 px-2.5 text-right font-bold text-[#c5a059]">
                        {item.overallAverage > 0 ? `${item.overallAverage.toFixed(1)} /100` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 Category Standings Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
            <div className="p-2.5 rounded bg-[#0d0408] border border-[#240a15]">
              <span className="text-gray-500 block text-[9px] uppercase font-bold">Best Mechanical</span>
              <span className="font-bold text-white truncate block">{teamStandings[0]?.team.name}</span>
              <span className="text-[#c5a059] text-[10px]">{teamStandings[0]?.mechAvg} /25</span>
            </div>

            <div className="p-2.5 rounded bg-[#0d0408] border border-[#240a15]">
              <span className="text-gray-500 block text-[9px] uppercase font-bold">Most Competitive</span>
              <span className="font-bold text-white truncate block">{teamStandings[0]?.team.name}</span>
              <span className="text-[#c5a059] text-[10px]">{teamStandings[0]?.compAvg} /25</span>
            </div>

            <div className="p-2.5 rounded bg-[#0d0408] border border-[#240a15]">
              <span className="text-gray-500 block text-[9px] uppercase font-bold">Eng. Innovation</span>
              <span className="font-bold text-white truncate block">{teamStandings[0]?.team.name}</span>
              <span className="text-[#c5a059] text-[10px]">{teamStandings[0]?.innovAvg} /25</span>
            </div>

            <div className="p-2.5 rounded bg-[#0d0408] border border-[#240a15]">
              <span className="text-gray-500 block text-[9px] uppercase font-bold">Sportsmanship</span>
              <span className="font-bold text-white truncate block">{teamStandings[0]?.team.name}</span>
              <span className="text-[#c5a059] text-[10px]">{teamStandings[0]?.sportsAvg} /25</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
