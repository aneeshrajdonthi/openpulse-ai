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
    <nav className="h-14 bg-black/95 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40 flex items-center justify-between px-4 text-zinc-200">
      {/* Left section: Logo and Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-white shadow-sm">
          <Activity size={18} className="text-zinc-200" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm tracking-tight">OpenPulse AI</span>
          <span className="px-1.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-mono leading-none">
            v2.0
          </span>
        </div>
      </div>

      {/* Center section: Repo selector & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
            className="flex items-center gap-2 h-8 px-3 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors text-xs font-mono font-medium text-zinc-200"
          >
            {selectedRepo ? `${selectedRepo.owner}/${selectedRepo.name}` : 'Select Repository'}
            <ChevronDown size={14} className="text-zinc-400" />
          </button>

          {isRepoDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl py-1 z-50">
              <div className="px-3 py-2 border-b border-zinc-800">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Repositories</span>
              </div>
              <div className="max-h-64 overflow-y-auto p-1 space-y-0.5">
                {repositories.map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => {
                      onSelectRepo(repo);
                      setIsRepoDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md font-mono transition-colors ${
                      selectedRepo?.id === repo.id
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-300 hover:bg-zinc-800/60'
                    }`}
                  >
                    <span className="truncate">{repo.owner}/{repo.name}</span>
                    {selectedRepo?.id === repo.id && <Check size={14} className="text-emerald-400" />}
                  </button>
                ))}
              </div>
              <div className="p-1 border-t border-zinc-800">
                <button
                  onClick={() => {
                    onOpenNewRepoModal();
                    setIsRepoDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors font-medium"
                >
                  <Plus size={14} />
                  <span>Connect New Repo...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 relative flex items-center">
          <Search size={14} className="absolute left-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Search files, modules, or ask AI..."
            className="w-full h-8 pl-9 pr-3 bg-zinc-900/80 border border-zinc-800 rounded-md text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 font-mono transition-all"
          />
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenAISettings}
          className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="AI Settings"
        >
          <SlidersHorizontal size={16} />
        </button>
        <button
          onClick={onToggleBeginnerGuide}
          className="text-xs font-medium text-zinc-400 hover:text-white px-3 h-8 flex items-center transition-colors"
        >
          Beginner Guide
        </button>
        <button
          onClick={onOpenNewRepoModal}
          className="h-8 px-3.5 bg-white hover:bg-zinc-200 text-black text-xs font-semibold rounded-md shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Analyze Repo</span>
        </button>
      </div>
    </nav>
  );
};
