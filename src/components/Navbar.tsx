import React, { useState, useRef, useEffect } from 'react';
import { Activity, ChevronDown, Search, Plus, Check, SlidersHorizontal, Sun, Moon } from 'lucide-react';
import type { Repository, AISettings } from '../types';

interface NavbarProps {
  repositories: Repository[];
  selectedRepo: Repository;
  onSelectRepo: (repo: Repository) => void;
  onOpenNewRepoModal: () => void;
  aiSettings: AISettings;
  onOpenAISettings: () => void;
  onToggleBeginnerGuide: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  onOpenNewRepoModal,
  onOpenAISettings,
  onToggleBeginnerGuide,
  theme,
  onToggleTheme,
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

  const isLight = theme === 'light';

  return (
    <nav className={`h-14 sticky top-0 z-40 flex items-center justify-between px-4 border-b transition-colors ${
      isLight 
        ? 'bg-white/90 backdrop-blur-md border-zinc-200 text-zinc-900 shadow-xs' 
        : 'bg-black/95 backdrop-blur-md border-zinc-800 text-zinc-200'
    }`}>
      {/* Left section: Logo and Brand */}
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg border shadow-xs ${
          isLight ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-800 border-zinc-700 text-white'
        }`}>
          <Activity size={18} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm tracking-tight ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            OpenPulse AI
          </span>
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono leading-none border ${
            isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-700 font-semibold' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
          }`}>
            v2.0
          </span>
        </div>
      </div>

      {/* Center section: Repo selector & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl mx-8">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
            className={`flex items-center gap-2 h-8 px-3 rounded-md border transition-colors text-xs font-mono font-semibold ${
              isLight 
                ? 'bg-zinc-100/80 hover:bg-zinc-200/70 border-zinc-200 text-zinc-900' 
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
            }`}
          >
            {selectedRepo ? `${selectedRepo.owner}/${selectedRepo.name}` : 'Select Repository'}
            <ChevronDown size={14} className={isLight ? 'text-zinc-500' : 'text-zinc-400'} />
          </button>

          {isRepoDropdownOpen && (
            <div className={`absolute top-full left-0 mt-1 w-64 border rounded-lg shadow-xl py-1 z-50 ${
              isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-800'
            }`}>
              <div className={`px-3 py-2 border-b ${isLight ? 'border-zinc-100' : 'border-zinc-800'}`}>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${isLight ? 'text-zinc-400' : 'text-zinc-400'}`}>
                  Repositories
                </span>
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
                        ? isLight ? 'bg-zinc-100 text-zinc-900 font-bold' : 'bg-zinc-800 text-white font-semibold'
                        : isLight ? 'text-zinc-700 hover:bg-zinc-50' : 'text-zinc-300 hover:bg-zinc-800/60'
                    }`}
                  >
                    <span className="truncate">{repo.owner}/{repo.name}</span>
                    {selectedRepo?.id === repo.id && <Check size={14} className={isLight ? 'text-zinc-900' : 'text-emerald-400'} />}
                  </button>
                ))}
              </div>
              <div className={`p-1 border-t ${isLight ? 'border-zinc-100' : 'border-zinc-800'}`}>
                <button
                  onClick={() => {
                    onOpenNewRepoModal();
                    setIsRepoDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isLight ? 'text-zinc-800 hover:bg-zinc-100' : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <Plus size={14} />
                  <span>Connect New Repo...</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 relative flex items-center">
          <Search size={14} className={`absolute left-3 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`} />
          <input
            type="text"
            placeholder="Search files, modules, or ask AI..."
            className={`w-full h-8 pl-9 pr-3 border rounded-md text-xs font-mono transition-all focus:outline-none ${
              isLight 
                ? 'bg-zinc-100/70 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white' 
                : 'bg-zinc-900/80 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-600'
            }`}
          />
        </div>
      </div>

      {/* Right section: Theme toggle & Actions */}
      <div className="flex items-center gap-2">
        {/* Sun / Moon Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-md transition-colors ${
            isLight 
              ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          onClick={onOpenAISettings}
          className={`p-2 rounded-md transition-colors ${
            isLight 
              ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
          title="AI Settings"
        >
          <SlidersHorizontal size={16} />
        </button>
        <button
          onClick={onToggleBeginnerGuide}
          className={`text-xs font-medium px-3 h-8 flex items-center transition-colors ${
            isLight ? 'text-zinc-600 hover:text-zinc-900' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Beginner Guide
        </button>
        <button
          onClick={onOpenNewRepoModal}
          className={`h-8 px-3.5 text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 ${
            isLight 
              ? 'bg-zinc-900 hover:bg-zinc-800 text-white' 
              : 'bg-white hover:bg-zinc-200 text-black'
          }`}
        >
          <Plus size={14} />
          <span>Analyze Repo</span>
        </button>
      </div>
    </nav>
  );
};
