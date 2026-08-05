import { useState, useEffect } from 'react';
import type { Repository } from '../types';
import confetti from 'canvas-confetti';
import { 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  Copy, 
  RefreshCw, 
  FileText, 
  Clock, 
  User,
  Check
} from 'lucide-react';

interface IssuePRStudioViewProps {
  repo: Repository;
  selectedIssueId?: string;
}

export function IssuePRStudioView({ repo, selectedIssueId }: IssuePRStudioViewProps) {
  const activeIssue = repo.issues.find(i => i.id === selectedIssueId) || repo.issues[0];
  const [currentIssueId, setCurrentIssueId] = useState<string>(activeIssue?.id || '');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPR, setCopiedPR] = useState(false);

  useEffect(() => {
    if (selectedIssueId) {
      setCurrentIssueId(selectedIssueId);
    } else if (activeIssue) {
      setCurrentIssueId(activeIssue.id);
    }
  }, [selectedIssueId, activeIssue]);

  const issue = repo.issues.find(i => i.id === currentIssueId) || activeIssue || repo.issues[0];

  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyPR = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPR(true);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopiedPR(false), 2000);
  };

  if (!issue) {
    return (
      <div className="p-8 text-center text-slate-400">
        No open issues found for repository {repo.owner}/{repo.name}.
      </div>
    );
  }

  const primaryDiff = issue.gitDiff[0] || {
    filePath: 'src/index.ts',
    oldCode: `// Existing implementation in ${repo.name}\nfunction handle() {\n  return false;\n}`,
    newCode: `// AI proposed fix for ${issue.title}\nfunction handle() {\n  return true;\n}`
  };

  const prDescription = `## 🤖 AI Resolution for Issue #${issue.number}: ${issue.title}

### Summary
This PR addresses issue #${issue.number} reported by @${issue.author}.

### Proposed Changes
${issue.proposedFixPlan.map(p => `- ${p}`).join('\n')}

### Affected Files
- \`${primaryDiff.filePath}\`

---
*Generated automatically by OpenPulse AI Studio for ${repo.owner}/${repo.name}*`;

  return (
    <div className="w-full flex flex-col space-y-6 text-slate-100 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">AI Issue Studio</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated code diff & PR resolution engine for <span className="text-indigo-400 font-mono">{repo.owner}/{repo.name}</span>
          </p>
        </div>
        <div className="relative">
          <select 
            value={issue.id}
            onChange={(e) => setCurrentIssueId(e.target.value)}
            className="appearance-none bg-[#12121c] border border-slate-800 rounded-lg py-2 pl-3 pr-9 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            {repo.issues.map(i => (
              <option key={i.id} value={i.id}>
                #{i.number} - {i.title.slice(0, 35)}...
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>

      {/* Issue details card */}
      <div className="bg-[#12121c] border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-indigo-400 font-mono text-sm font-semibold">#{issue.number}</span>
              <h2 className="text-base font-bold text-white">{issue.title}</h2>
            </div>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.05]">
              {issue.body}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-500" /> @{issue.author}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> {issue.createdAgo}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 shrink-0">
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              {issue.difficulty}
            </span>
            {issue.labels.map((lbl, idx) => (
              <span key={idx} className="px-2.5 py-1 text-[11px] font-medium bg-white/[0.05] text-slate-300 border border-white/[0.08] rounded-full">
                {lbl}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Column: Resolution Steps */}
        <div className="w-full lg:w-1/3 flex flex-col gap-5">
          <div className="bg-[#12121c] border border-slate-800 rounded-xl p-5 flex-1 flex flex-col shadow-lg">
            <h3 className="font-semibold text-sm text-white mb-3.5 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Proposed Fix Plan
            </h3>
            <div className="space-y-2.5 flex-1">
              {issue.proposedFixPlan.map((stepText, idx) => {
                const isChecked = !!completedSteps[idx];
                return (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-colors group"
                    onClick={() => toggleStep(idx)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                      )}
                    </div>
                    <span className={`text-xs leading-relaxed ${isChecked ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">Auto-Generated Unit Test</h4>
              <div className="bg-[#0a0a0f] rounded-lg p-3 text-[11px] font-mono text-emerald-400 border border-slate-800 overflow-x-auto">
                <pre>{issue.generatedTests[0] || `describe("Issue #${issue.number}", () => { it("passes regression test", () => { ... }); });`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Diff Viewer */}
        <div className="w-full lg:w-2/3 flex flex-col bg-[#12121c] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="border-b border-slate-800 px-4 py-2.5 flex items-center justify-between bg-[#0e0e17]">
            <span className="text-xs font-mono text-indigo-300 font-medium">{primaryDiff.filePath}</span>
            <button 
              onClick={() => handleCopyCode(primaryDiff.newCode)}
              className="px-2.5 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-xs text-slate-300 rounded border border-white/[0.08] transition-colors flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4 font-mono text-xs">
            {/* Before Code */}
            <div>
              <div className="text-[10px] text-rose-400 mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-1">
                <span>− Original Code</span>
              </div>
              <div className="bg-rose-950/20 text-rose-200 p-3.5 rounded-lg border border-rose-500/20 overflow-x-auto">
                <pre>{primaryDiff.oldCode}</pre>
              </div>
            </div>
            {/* After Code */}
            <div>
              <div className="text-[10px] text-emerald-400 mb-1.5 uppercase tracking-wider font-semibold flex items-center gap-1">
                <span>+ AI Generated Fix</span>
              </div>
              <div className="bg-emerald-950/20 text-emerald-200 p-3.5 rounded-lg border border-emerald-500/20 overflow-x-auto">
                <pre>{primaryDiff.newCode}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button 
          onClick={() => handleCopyPR(prDescription)}
          className="px-4 py-2 text-xs font-medium bg-white/[0.05] text-slate-200 rounded-lg border border-white/[0.08] hover:bg-white/[0.1] transition-colors flex items-center gap-1.5"
        >
          {copiedPR ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedPR ? 'Copied PR Description!' : 'Copy PR Description'}</span>
        </button>
        <button 
          onClick={() => confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } })}
          className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm shadow-indigo-500/20 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-run AI Analysis</span>
        </button>
      </div>
    </div>
  );
}
