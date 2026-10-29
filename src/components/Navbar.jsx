import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Swords, 
  Calendar, 
  Users, 
  Award, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Download, 
  Upload, 
  Clock, 
  ClipboardCheck,
  Undo2,
  Redo2
} from 'lucide-react';
import { TOURNAMENT_METADATA } from '../data/initialData';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  tournamentState, 
  onResetTournament, 
  onExportData, 
  onImportData, 
  onUndo,
  canUndo,
  onRedo,
  canRedo,
  soundEnabled, 
  setSoundEnabled 
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalMatches = tournamentState.matches.length;
  const completedMatches = tournamentState.matches.filter(m => m.status === 'COMPLETED').length;

  const navItems = [
    { id: 'ring', label: 'Dual Arenas (Live)', icon: Swords },
    { id: 'bracket', label: 'Knockout Bracket', icon: Trophy },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'homologation', label: 'Homologation (§7)', icon: ClipboardCheck },
    { id: 'teams', label: 'Teams & Draw', icon: Users },
    { id: 'prizes', label: 'Special Prizes (§14)', icon: Award },
    { id: 'rules', label: 'Handbook', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#100308]/98 backdrop-blur border-b border-[#280c18] shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#1c0812] border border-[#d99c26]/60 flex flex-col items-center justify-center font-mono">
            <span className="text-[7px] font-black text-[#d99c26] leading-none">IEEE</span>
            <span className="text-[5px] font-bold text-white tracking-widest leading-none mt-0.5">RAS</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#a68f97]">
              <span className="text-[#d99c26] font-bold">E-JUST HQ</span>
              <span>•</span>
              <span>OCTOBER 30, 2026</span>
            </div>
            <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
              <span>SUMO ROBOT JUDGES SYSTEM</span>
              <span className="text-[9px] font-mono text-[#d99c26] bg-[#1a0812] px-1.5 py-0.2 rounded border border-[#3b1222]">
                22 Teams
              </span>
            </div>
          </div>
        </div>

        {/* Global Action Tools: Undo, Redo, Sound, Export, Reset */}
        <div className="flex items-center gap-2 font-mono text-xs">
          
          {/* UNDO & REDO BUTTONS */}
          <div className="flex items-center gap-1 p-0.5 rounded bg-[#180710] border border-[#2d0e1d]">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                canUndo
                  ? 'bg-[#290e1b] text-[#d99c26] hover:bg-[#381325] border border-[#d99c26]/40 cursor-pointer'
                  : 'text-gray-600 cursor-not-allowed opacity-40'
              }`}
              title="Undo last action (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                canRedo
                  ? 'bg-[#290e1b] text-[#d99c26] hover:bg-[#381325] border border-[#d99c26]/40 cursor-pointer'
                  : 'text-gray-600 cursor-not-allowed opacity-40'
              }`}
              title="Redo action (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span>Redo</span>
            </button>
          </div>

          {/* Progress */}
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-[#16060e] border border-[#280c18] text-[10px]">
            <span className="text-[#a68f97]">PROGRESS:</span>
            <span className="font-bold text-[#d99c26]">{completedMatches}/{totalMatches}</span>
          </div>

          {/* Clock */}
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#16060e] border border-[#280c18] text-white text-[10px]">
            <Clock className="w-3 h-3 text-[#d99c26]" />
            <span>{time}</span>
          </div>

          {/* Audio, JSON & Reset */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Referee Signals' : 'Enable Referee Signals'}
              className={`p-1.5 rounded text-xs border ${
                soundEnabled 
                  ? 'bg-[#1e0a13] text-[#d99c26] border-[#d99c26]/40' 
                  : 'bg-[#100308] text-gray-500 border-gray-800'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onExportData}
              title="Export Ledger (JSON)"
              className="p-1.5 rounded bg-[#180710] text-[#a68f97] border border-[#280c18] hover:text-white"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <label
              title="Import Ledger (JSON)"
              className="p-1.5 rounded bg-[#180710] text-[#a68f97] border border-[#280c18] hover:text-white cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <input type="file" accept=".json" onChange={onImportData} className="hidden" />
            </label>

            <button
              onClick={onResetTournament}
              title="Reset Draw (Supports Undo)"
              className="p-1.5 rounded bg-[#200712] text-rose-400 border border-rose-900/50 hover:bg-rose-950"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <nav className="flex space-x-1 py-1 overflow-x-auto no-scrollbar font-mono text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#220c18] text-[#f5b945] font-bold border-b-2 border-[#d99c26]'
                    : 'text-[#a68f97] hover:text-white hover:bg-[#16060e]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#d99c26]' : 'text-[#8c747d]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
