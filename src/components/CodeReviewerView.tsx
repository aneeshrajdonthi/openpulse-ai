import { useState } from 'react';
import type { Repository } from '../types';
import { Play, Shield, Activity, AlertTriangle, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CodeReviewerViewProps {
  repo: Repository;
}

export function CodeReviewerView({ repo }: CodeReviewerViewProps) {
  const [code, setCode] = useState(`function calculateRisk(score) {
  if (score > 90) return "high";
  if (score > 70) return "medium";
  return "low";
}`);

  const [fixedIssues, setFixedIssues] = useState<Record<string, boolean>>({});
  const [isScanning, setIsScanning] = useState(false);

  const activeIssuesCount = 2 - Object.keys(fixedIssues).length;
  const qualityScore = 98 + Object.keys(fixedIssues).length * 1;

  const handleApplyFix = (issueId: string) => {
    setFixedIssues(prev => ({ ...prev, [issueId]: true }));
    
    if (issueId === 'issue-1') {
      setCode(`function calculateRisk(score: number): "high" | "medium" | "low" {
  if (score > 90) return "high";
  if (score > 70) return "medium";
  return "low";
}`);
    } else if (issueId === 'issue-2') {
      setCode(`function calculateRisk(score: number): "high" | "medium" | "low" {
  if (typeof score !== 'number' || score < 0) {
    throw new IllegalArgumentError("Score must be a non-negative number");
  }
  if (score > 90) return "high";
  if (score > 70) return "medium";
  return "low";
}`);
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full space-y-6 text-slate-100 p-2 md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">AI Code Reviewer (SAST Security Audit)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Static analysis & AI vulnerability scanner for <span className="text-indigo-400 font-mono">{repo.owner}/{repo.name}</span>
          </p>
        </div>
        <button 
          onClick={handleRunScan}
          disabled={isScanning}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all"
        >
          {isScanning ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
              <span>Scanning Codebase...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Run SAST Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#12121c] border border-slate-800 rounded-xl p-4 shadow-lg flex items-center space-x-4">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Security Rating</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">A+</p>
          </div>
        </div>

        <div className="bg-[#12121c] border border-slate-800 rounded-xl p-4 shadow-lg flex items-center space-x-4">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quality Score</p>
            <p className="text-2xl font-bold text-white font-mono">{qualityScore}/100</p>
          </div>
        </div>

        <div className="bg-[#12121c] border border-slate-800 rounded-xl p-4 shadow-lg flex items-center space-x-4">
          <div className={`p-2.5 rounded-lg border ${
            activeIssuesCount > 0 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {activeIssuesCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Issues</p>
            <p className="text-2xl font-bold text-white font-mono">{activeIssuesCount}</p>
          </div>
        </div>
      </div>

      {/* Two-Column Editor & Audit Findings */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left: Code Editor */}
        <div className="flex flex-col border border-slate-800 rounded-xl overflow-hidden bg-[#0e0e17] shadow-lg">
          <div className="bg-[#12121c] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-300 font-medium">src/utils.ts</span>
            <span className="text-[10px] text-slate-500 font-mono">TypeScript strict check</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 w-full p-4 bg-transparent resize-none focus:outline-none font-mono text-xs leading-relaxed text-slate-200"
            spellCheck={false}
          />
        </div>

        {/* Right: Security & Quality Audit Findings */}
        <div className="flex flex-col space-y-4 overflow-y-auto pr-1">
          {/* Issue 1 */}
          {!fixedIssues['issue-1'] ? (
            <div className="bg-[#12121c] border border-rose-500/20 rounded-xl p-4 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-semibold rounded-full">
                  <AlertCircle className="w-3 h-3 mr-1" /> Critical
                </span>
                <span className="text-xs font-mono text-slate-400">Line 2</span>
              </div>
              <p className="text-xs font-semibold text-white">Missing type declaration for 'score' parameter.</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300">Recommendation:</span> Add appropriate TypeScript type to ensure strict type safety.
              </p>
              <button
                onClick={() => handleApplyFix('issue-1')}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-indigo-500/20"
              >
                Apply AI Fix (Add Type Annotation)
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Line 2: Type declaration fix applied!
              </span>
              <span className="font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Resolved</span>
            </div>
          )}

          {/* Issue 2 */}
          {!fixedIssues['issue-2'] ? (
            <div className="bg-[#12121c] border border-amber-500/20 rounded-xl p-4 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold rounded-full">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Warning
                </span>
                <span className="text-xs font-mono text-slate-400">Line 4</span>
              </div>
              <p className="text-xs font-semibold text-white">Potential unhandled edge case (negative inputs / type guards).</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-300">Recommendation:</span> Consider validating negative scores and non-numeric runtime types.
              </p>
              <button
                onClick={() => handleApplyFix('issue-2')}
                className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white py-2 rounded-lg text-xs font-semibold transition-colors"
              >
                Apply AI Fix (Add Edge Case Guard)
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Line 4: Negative input validation fix applied!
              </span>
              <span className="font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Resolved</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
