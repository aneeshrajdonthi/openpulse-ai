import React, { useState, useRef, useEffect } from 'react';
import { Activity, ChevronDown, Search, Plus, Check, SlidersHorizontal } from 'lucide-react';
import type { Repository, AISettings } from '../types';

interface NavbarProps {
  repositories: Repository[];
  selectedRepo: Repository;
  onSelectRepo: (repo: Repository) => void;
  onOpenNewRepoModal: () => void;
  aiSettings: AISettings;
  onOpenAISettings: () => void;
  onToggleBeginnerGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  onOpenNewRepoModal,
  onOpenAISettings,
  onToggleBeginnerGuide,
}) => {
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRepoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="h-14 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 flex items-center justify-between px-4 text-slate-200">
      {/* Left section: Logo and Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-500/20">
          <Activity size={18} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm tracking-tight">OpenPulse AI</span>
          <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-medium leading-none">
            v2.0
          </span>
        </div>
      </div>

      {/* Center section: Repo selector & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
            className="flex items-center gap-2 h-8 px-3 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors text-xs font-medium text-slate-200"
          >
            {selectedRepo ? `${selectedRepo.owner}/${selectedRepo.name}` : 'Select Repository'}
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {isRepoDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-[#12121c] border border-slate-800 rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-2 border-b border-slate-800/60">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Repositories</span>
              </div>
              <div className="max-h-64 overflow-y-auto p-1 space-y-0.5">
                {repositories.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => {
                      onSelectRepo(repo);
                      setIsRepoDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                      selectedRepo?.id === repo.id
                        ? 'bg-indigo-600/15 text-indigo-300 font-medium'
                        : 'text-slate-300 hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="truncate">{repo.owner}/{repo.name}</span>
                    {selectedRepo?.id === repo.id && <Check size={14} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
              <div className="p-1 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    onOpenNewRepoModal();
                    setIsRepoDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-colors font-medium"
                >
                  <Plus size={14} />
                  <span>Connect New Repo...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 relative flex items-center">
          <Search size={14} className="absolute left-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search files, modules, or ask AI..."
            className="w-full h-8 pl-9 pr-3 bg-white/[0.03] border border-white/[0.08] rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAISettings}
          className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          title="AI Settings"
        >
          <SlidersHorizontal size={16} />
        </button>
        <button
          onClick={onToggleBeginnerGuide}
          className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 h-8 flex items-center transition-colors"
        >
          Beginner Guide
        </button>
        <button
          onClick={onOpenNewRepoModal}
          className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-md shadow-sm shadow-indigo-500/20 transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Analyze Repo</span>
        </button>
      </div>
    </nav>
  );
};
