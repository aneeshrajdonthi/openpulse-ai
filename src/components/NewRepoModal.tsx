import React, { useState } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Repository } from '../types';
import { fetchRealGitHubRepo } from '../services/githubApi';

const GithubIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface NewRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRepo: (repo: Repository) => void;
}

export const NewRepoModal: React.FC<NewRepoModalProps> = ({
  isOpen,
  onClose,
  onAddRepo
}) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsAnalyzing(true);
    setAnalysisStep(1);
    setErrorMessage(null);

    try {
      // Step 1: Connecting to GitHub REST API
      const step2Timer = setTimeout(() => setAnalysisStep(2), 500);
      const step3Timer = setTimeout(() => setAnalysisStep(3), 1000);

      const newRepo = await fetchRealGitHubRepo(repoUrl);

      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setAnalysisStep(3);

      setTimeout(() => {
        setIsAnalyzing(false);
        onAddRepo(newRepo);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onClose();
        setRepoUrl('');
        setAnalysisStep(0);
      }, 500);

    } catch (err: any) {
      setIsAnalyzing(false);
      setAnalysisStep(0);
      setErrorMessage(err.message || 'Failed to fetch GitHub repository data.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg p-6 space-y-5 bg-[#12121c] border border-slate-800 rounded-xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GithubIcon className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">Analyze Any GitHub Repository</h2>
          </div>
          <p className="text-xs text-slate-400">
            Enter a real public GitHub repository (e.g., <code className="text-indigo-300 bg-indigo-500/10 px-1 py-0.5 rounded">facebook/react</code>, <code className="text-indigo-300 bg-indigo-500/10 px-1 py-0.5 rounded">tailwindlabs/tailwindcss</code>, or your own repo) to fetch live architecture and real issues via GitHub API.
          </p>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">GitHub Repository URL or owner/repo:</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="e.g. facebook/react or https://github.com/vercel/next.js"
              className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.1] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-all"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-2 text-xs text-rose-400">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isAnalyzing && (
            <div className="space-y-2 p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-lg text-xs text-indigo-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                <span className="font-semibold">Fetching Live Data from GitHub API...</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-300 pl-6">
                <div className={analysisStep >= 1 ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {analysisStep >= 1 ? '✓' : '○'} Querying GitHub REST API metadata & stars...
                </div>
                <div className={analysisStep >= 2 ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {analysisStep >= 2 ? '✓' : '○'} Mapping directory modules & file tree...
                </div>
                <div className={analysisStep >= 3 ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                  {analysisStep >= 3 ? '✓' : '○'} Parsing open issues & generating fix plans...
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-medium rounded-lg border border-white/[0.08] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing || !repoUrl.trim()}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg shadow-sm shadow-indigo-500/20 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isAnalyzing ? 'Analyzing Real Repo...' : 'Connect & Analyze'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
