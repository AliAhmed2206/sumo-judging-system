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
  Redo2,
  Radio,
  Share2,
  Lock,
  Unlock,
  RefreshCw,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { TOURNAMENT_METADATA } from '../data/initialData';
import { UserRole } from '../utils/cloudSync';

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
  setSoundEnabled,
  userRole = UserRole.SPECTATOR,
  setUserRole,
  syncStatus = 'CONNECTED',
  lastSyncedAt = null,
  onForceSync,
  onShareLink
}) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalMatches = tournamentState.matches.length;
  const completedMatches = tournamentState.matches.filter(m => m.status === 'COMPLETED').length;

  const isJudge = userRole === UserRole.JUDGE;

  const handlePinSubmit = (e) => {
    e.preventDefault();
    // Default passcodes for referee access: '1234' or 'ejust' or 'sumo'
    const validPins = ['1234', 'ejust', 'sumo', '2026', 'admin'];
    if (validPins.includes(pinInput.trim().toLowerCase())) {
      setUserRole(UserRole.JUDGE);
      setShowRoleModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

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
    <header className="sticky top-0 z-50 bg-[#100308]/98 backdrop-blur border-b border-[#280c18] shadow-md select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Brand & Live Sync Pill */}
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

          {/* Cloud Sync Status Indicator */}
          <div 
            onClick={onForceSync}
            title={`Cloud Sync: ${syncStatus}. Click to force sync.`}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1c0914] border border-[#3b1224] text-[9px] font-mono cursor-pointer hover:border-[#d99c26] transition-colors"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              syncStatus === 'SYNCING' 
                ? 'bg-amber-400 animate-spin' 
                : syncStatus === 'CONNECTED' 
                ? 'bg-emerald-400 animate-pulse' 
                : 'bg-rose-500'
            }`} />
            <span className="text-[#f4ede2] font-semibold">LIVE SYNC</span>
          </div>
        </div>

        {/* Global Action Tools: Undo, Redo, Role Switcher, Share Link, Audio, Export */}
        <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
          
          {/* ROLE SWITCHER BUTTON */}
          {isJudge ? (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#290e1b] border border-[#d99c26]/60 text-[#d99c26] text-[10px] font-bold">
              <Unlock className="w-3 h-3 text-[#d99c26]" />
              <span>JUDGE MODE</span>
              <button
                onClick={() => setUserRole(UserRole.SPECTATOR)}
                className="ml-1 text-[9px] text-[#a68f97] hover:text-white underline cursor-pointer"
                title="Switch to Spectator View"
              >
                (Lock)
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowRoleModal(true)}
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#16060e] border border-[#3b1224] text-[#a68f97] hover:text-white hover:border-[#d99c26] text-[10px] font-bold transition-colors cursor-pointer"
              title="Click to enter Referee/Judge mode with PIN"
            >
              <Eye className="w-3 h-3 text-[#a68f97]" />
              <span>SPECTATOR VIEW</span>
              <Lock className="w-2.5 h-2.5 text-[#d99c26]" />
            </button>
          )}

          {/* SHARE LIVE LINK BUTTON */}
          <button
            onClick={onShareLink}
            title="Copy Live Tournament Link for Spectators"
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#1e0a13] text-[#f5b945] border border-[#d99c26]/40 hover:bg-[#2b0e1b] text-[10px] font-bold transition-colors cursor-pointer"
          >
            <Share2 className="w-3 h-3 text-[#d99c26]" />
            <span className="hidden md:inline">Share Live</span>
          </button>

          {/* UNDO & REDO BUTTONS (Only enabled for judges) */}
          {isJudge && (
            <div className="flex items-center gap-1 p-0.5 rounded bg-[#180710] border border-[#2d0e1d]">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  canUndo
                    ? 'bg-[#290e1b] text-[#d99c26] hover:bg-[#381325] border border-[#d99c26]/40 cursor-pointer'
                    : 'text-gray-600 cursor-not-allowed opacity-40'
                }`}
                title="Undo last action (Ctrl+Z)"
              >
                <Undo2 className="w-3 h-3" />
                <span>Undo</span>
              </button>

              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  canRedo
                    ? 'bg-[#290e1b] text-[#d99c26] hover:bg-[#381325] border border-[#d99c26]/40 cursor-pointer'
                    : 'text-gray-600 cursor-not-allowed opacity-40'
                }`}
                title="Redo action (Ctrl+Y)"
              >
                <Redo2 className="w-3 h-3" />
                <span>Redo</span>
              </button>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-[#16060e] border border-[#280c18] text-[10px]">
            <span className="text-[#a68f97]">MATCHES:</span>
            <span className="font-bold text-[#d99c26]">{completedMatches}/{totalMatches}</span>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-[#16060e] border border-[#280c18] text-white text-[10px]">
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

            {isJudge && (
              <>
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
              </>
            )}
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
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

      {/* Passcode Modal for Referee Mode */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-lg bg-[#1a0812] border border-[#4a1626] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#2b0e1b]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#d99c26]" />
                <h3 className="text-sm font-bold text-white">Enter Referee Access PIN</h3>
              </div>
              <button onClick={() => setShowRoleModal(false)} className="text-[#a68f97] hover:text-white">✕</button>
            </div>

            <p className="text-xs text-[#a68f97]">
              Referee Mode unlocks match scoring, timer controls, and homologation checks.
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-3 font-mono">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="Enter PIN (Default: 1234 or ejust)"
                  autoFocus
                  className="w-full px-3 py-2 rounded bg-[#10040a] border border-[#3b1224] text-white text-sm focus:outline-none focus:border-[#d99c26]"
                />
                {pinError && (
                  <p className="text-xs text-rose-400 mt-1">Invalid PIN. Try '1234' or 'ejust'.</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setUserRole(UserRole.JUDGE);
                    setShowRoleModal(false);
                  }}
                  className="text-[10px] text-[#a68f97] hover:underline"
                >
                  Bypass (Judge Deck)
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#d99c26] text-[#1b1002] font-black text-xs hover:bg-[#f5b945] transition-colors"
                >
                  Unlock Referee Mode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}