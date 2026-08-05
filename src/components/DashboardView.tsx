import { 
  Activity, 
  AlertCircle, 
  Code, 
  Terminal,
  Star,
  GitFork,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import type { Repository, ActiveTab } from '../types';

interface DashboardViewProps {
  repo: Repository;
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectIssueToFix: (issueId: string) => void;
}

export function DashboardView({ repo, onNavigateTab, onSelectIssueToFix }: DashboardViewProps) {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 font-sans p-4 md:p-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-indigo-400 font-semibold">{repo.owner} /</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">{repo.name}</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {repo.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>{repo.stars.toLocaleString()} stars</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300">
            <GitFork className="w-3.5 h-3.5 text-indigo-400" />
            <span>{repo.forks.toLocaleString()} forks</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-[#12121c] flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Open Issues</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tracking-tight font-mono">{repo.openIssues}</span>
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              {repo.goodFirstIssuesCount} GFI
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#12121c] flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Primary Language</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tracking-tight font-mono">{repo.language}</span>
            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#12121c] flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Architecture Modules</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white tracking-tight font-mono">{repo.architectureNodes.length}</span>
            <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              AST Parsed
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-[#12121c] flex flex-col justify-between shadow-lg">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Code Health Score</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">{repo.healthScore}%</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> High
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Activity, title: 'Architecture Graph', desc: 'Inspect module AST dependencies', tab: 'architecture' as ActiveTab },
          { icon: AlertCircle, title: 'AI Issue Studio', desc: 'Auto-generate PR fixes & diffs', tab: 'issue-studio' as ActiveTab },
          { icon: Code, title: 'Code Reviewer', desc: 'Scan code for security & bugs', tab: 'code-reviewer' as ActiveTab },
          { icon: Terminal, title: 'Live Sandbox', desc: 'Run code tests in isolated env', tab: 'sandbox' as ActiveTab },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <button 
              key={i} 
              onClick={() => onNavigateTab(action.tab)}
              className="flex flex-col items-start p-4 rounded-xl border border-slate-800 bg-[#12121c] hover:bg-white/[0.03] hover:border-slate-700 transition-all text-left group shadow-md"
            >
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-semibold text-white tracking-tight">{action.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="text-[11px] text-slate-400 leading-snug">{action.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Recent Open Issues List */}
      <div className="flex flex-col space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Open Issues ({repo.issues.length})</h2>
          <button 
            onClick={() => onNavigateTab('issue-studio')}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            View All in Issue Studio
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col border border-slate-800 rounded-xl overflow-hidden bg-[#12121c] shadow-lg">
          {repo.issues.map((issue, i) => (
            <div 
              key={issue.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:bg-white/[0.02] transition-colors ${
                i !== 0 ? 'border-t border-slate-800/60' : ''
              }`}
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">
                  #{issue.number}
                </span>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium text-slate-100">{issue.title}</span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
                    <span>Opened by @{issue.author} • {issue.createdAgo}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      issue.difficulty === 'Good First Issue' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                      issue.difficulty === 'Intermediate' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                      'border-rose-500/30 text-rose-400 bg-rose-500/10'
                    }`}>
                      {issue.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onSelectIssueToFix(issue.id)}
                className="self-end sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm shadow-indigo-500/20 shrink-0"
              >
                <Terminal className="w-3.5 h-3.5" />
                Fix with AI
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
