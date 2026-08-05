import { useState, useEffect } from 'react';
import type { Repository, CodeReviewFile } from '../types';
import { Play, Shield, Activity, AlertTriangle, AlertCircle, CheckCircle2, Sparkles, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CodeReviewerViewProps {
  repo: Repository;
}

export function CodeReviewerView({ repo }: CodeReviewerViewProps) {
  // Default files built dynamically if repo.codeReviewFiles is empty
  const defaultFiles: CodeReviewFile[] = [
    {
      id: 'cr-1',
      fileName: `src/${repo.name}Core.ts`,
      code: `// ${repo.name} Core Entry Point
export function runAnalysis(options) {
  if (options.depth > 10) {
    return parseDeepTree(options.target);
  }
  return parseRoot(options.target);
}`,
      securityRating: 'A+',
      qualityScore: 92,
      findings: [
        {
          id: 'f-1',
          line: 2,
          severity: 'critical',
          type: 'Type Safety',
          message: `Missing type declaration for 'options' parameter in ${repo.name}.`,
          recommendation: 'Add appropriate TypeScript interface for options parameter.',
          fixedCode: `// ${repo.name} Core Entry Point
export interface AnalysisOptions {
  depth: number;
  target: string;
}

export function runAnalysis(options: AnalysisOptions) {
  if (options.depth > 10) {
    return parseDeepTree(options.target);
  }
  return parseRoot(options.target);
}`
        },
        {
          id: 'f-2',
          line: 3,
          severity: 'warning',
          type: 'Edge Case',
          message: 'Unhandled null options object or negative depth value.',
          recommendation: 'Add runtime boundary check before dereferencing options properties.',
          fixedCode: `// ${repo.name} Core Entry Point
export function runAnalysis(options: AnalysisOptions) {
  if (!options) throw new Error("Options object is required");
  if (options.depth > 10) {
    return parseDeepTree(options.target);
  }
  return parseRoot(options.target);
}`
        }
      ]
    },
    {
      id: 'cr-2',
      fileName: `src/config.ts`,
      code: `// ${repo.name} Environment Config
export const config = {
  apiUrl: process.env.API_URL || "http://localhost:3000",
  timeout: process.env.TIMEOUT || 5000,
};`,
      securityRating: 'A',
      qualityScore: 96,
      findings: [
        {
          id: 'f-3',
          line: 4,
          severity: 'warning',
          type: 'Type Safety',
          message: 'Unparsed string assigned to numeric timeout property.',
          recommendation: 'Use parseInt(process.env.TIMEOUT, 10) to guarantee numeric type.',
          fixedCode: `// ${repo.name} Environment Config
export const config = {
  apiUrl: process.env.API_URL || "http://localhost:3000",
  timeout: parseInt(process.env.TIMEOUT || "5000", 10),
};`
        }
      ]
    }
  ];

  const files = (repo.codeReviewFiles && repo.codeReviewFiles.length > 0) ? repo.codeReviewFiles : defaultFiles;
  const [selectedFileId, setSelectedFileId] = useState<string>(files[0]?.id || '');
  const [isScanning, setIsScanning] = useState(false);

  const activeFile = files.find(f => f.id === selectedFileId) || files[0];
  const [code, setCode] = useState<string>(activeFile?.code || '');
  const [resolvedFindings, setResolvedFindings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeFile) {
      setCode(activeFile.code);
    }
  }, [selectedFileId, activeFile]);

  const activeFindings = activeFile.findings.filter(f => !resolvedFindings[f.id]);
  const activeIssuesCount = activeFindings.length;
  const qualityScore = activeFile.qualityScore + (activeFile.findings.length - activeFindings.length) * 4;

  const handleApplyFix = (findingId: string, fixedCode: string) => {
    setResolvedFindings(prev => ({ ...prev, [findingId]: true }));
    setCode(fixedCode);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full space-y-6 text-slate-100 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">AI Code Reviewer (SAST Audit)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Static security & quality scanner for <span className="text-indigo-400 font-mono">{repo.owner}/{repo.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* File Dropdown */}
          <div className="relative">
            <select
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
              className="appearance-none bg-[#12121c] border border-slate-800 rounded-lg py-2 pl-3 pr-9 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
            >
              {files.map(f => (
                <option key={f.id} value={f.id}>
                  {f.fileName} ({f.findings.length} findings)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>

          <button 
            onClick={handleRunScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all shrink-0"
          >
            {isScanning ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-200" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run SAST Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#12121c] border border-slate-800 rounded-xl p-4 shadow-lg flex items-center space-x-4">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Security Rating</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono">{activeFile.securityRating}</p>
          </div>
        </div>

        <div className="bg-[#12121c] border border-slate-800 rounded-xl p-4 shadow-lg flex items-center space-x-4">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quality Score</p>
            <p className="text-2xl font-bold text-white font-mono">{Math.min(100, qualityScore)}/100</p>
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
            <span className="text-xs font-mono text-indigo-300 font-semibold">{activeFile.fileName}</span>
            <span className="text-[10px] text-slate-500 font-mono">AST Type Safety Audit</span>
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
          {activeFile.findings.map((finding) => {
            const isResolved = !!resolvedFindings[finding.id];
            if (isResolved) {
              return (
                <div key={finding.id} className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-400">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Line {finding.line}: {finding.type} issue resolved!
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Resolved</span>
                </div>
              );
            }

            const isCritical = finding.severity === 'critical';
            return (
              <div 
                key={finding.id} 
                className={`bg-[#12121c] border rounded-xl p-4 shadow-lg space-y-2.5 ${
                  isCritical ? 'border-rose-500/30' : 'border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                    isCritical 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {isCritical ? <AlertCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                    {finding.severity.toUpperCase()} • {finding.type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Line {finding.line}</span>
                </div>

                <p className="text-xs font-semibold text-white">{finding.message}</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-300">Recommendation:</span> {finding.recommendation}
                </p>

                <button
                  onClick={() => handleApplyFix(finding.id, finding.fixedCode)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                    isCritical 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20' 
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  Apply AI Fix for {activeFile.fileName}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
