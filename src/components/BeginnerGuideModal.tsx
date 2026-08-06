import React from 'react';
import { X, ShieldCheck, ArrowRight, Code2, Cpu, Globe } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-2xl p-6 md:p-8 space-y-6 bg-[#12121c] border border-slate-800 rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Beginner Guide & Handbook
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ELI5 Mode (Simple Language)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Complete Beginner's Guide to OpenPulse AI
          </h2>
          <p className="text-xs text-slate-400">
            Learn what GitHub notation means, how OpenPulse AI works, and how to use it for your portfolio.
          </p>
        </div>

        {/* Section 1: Understanding GitHub URL Notation */}
        <div className="space-y-4 text-xs leading-relaxed">
          <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" /> 1. What does "facebook/react" or "vercel/next.js" mean?
            </h3>
            <p className="text-slate-300">
              On GitHub, projects are always written in the format: <code className="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded font-mono font-semibold">owner / repository_name</code>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 bg-[#0a0a0f] rounded-lg border border-slate-800">
                <span className="font-bold text-indigo-300">facebook / react</span>
                <p className="text-slate-400 mt-0.5">
                  <strong>facebook</strong> = Organization/Company that owns the repo.<br />
                  <strong>react</strong> = The actual software project (React framework).
                </p>
              </div>
              <div className="p-2.5 bg-[#0a0a0f] rounded-lg border border-slate-800">
                <span className="font-bold text-indigo-300">vercel / next.js</span>
                <p className="text-slate-400 mt-0.5">
                  <strong>vercel</strong> = Company that maintains Next.js.<br />
                  <strong>next.js</strong> = The web framework software.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Your own projects follow this exact same rule! For example: <code className="text-indigo-300 font-mono">aneeshrajdonthi / openpulse-ai</code>.
            </p>
          </div>

          {/* Section 2: AI Model Providers & BYOK */}
          <div className="p-4 bg-white/[0.03] border border-slate-800 rounded-xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> 2. Can you use OpenAI (GPT-4o), Claude, or Local LLMs?
            </h3>
            <p className="text-slate-300">
              <strong>YES!</strong> You are not locked into Google Gemini. OpenPulse AI supports multi-provider model switching:
            </p>
            <ul className="space-y-1 list-disc pl-4 text-slate-400 text-[11px]">
              <li><strong className="text-slate-200">Google Gemini</strong>: <code className="text-indigo-300">gemini-2.0-flash</code> (Fast & default free quota).</li>
              <li><strong className="text-slate-200">OpenAI</strong>: <code className="text-indigo-300">gpt-4o</code> or <code className="text-indigo-300">gpt-4o-mini</code> (Paste your OpenAI key).</li>
              <li><strong className="text-slate-200">Anthropic Claude</strong>: <code className="text-indigo-300">claude-3-5-sonnet</code> (Best for complex coding).</li>
              <li><strong className="text-slate-200">Local LLM / Ollama</strong>: Run offline models locally on your computer with 0 API cost!</li>
            </ul>
            <p className="text-[11px] text-slate-400">
              Click the <strong className="text-slate-200">Sliders/Settings icon</strong> in the top navbar to paste your key or switch providers anytime.
            </p>
          </div>

          {/* Section 3: Overview of OpenPulse AI Tools */}
          <div className="p-4 bg-white/[0.03] border border-slate-800 rounded-xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" /> 3. What does each tool in OpenPulse AI do?
            </h3>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="p-2 bg-[#0a0a0f] rounded-lg border border-slate-800">
                <strong className="text-indigo-400">📊 Dashboard:</strong> Overview of stargazers, forks, health score, open issues count, and quick stats for the selected repository.
              </div>
              <div className="p-2 bg-[#0a0a0f] rounded-lg border border-slate-800">
                <strong className="text-indigo-400">🌐 Architecture Graph:</strong> Visualizes the file system module structure so you understand how top-level folders connect.
              </div>
              <div className="p-2 bg-[#0a0a0f] rounded-lg border border-slate-800">
                <strong className="text-indigo-400">🤖 AI Issue Studio:</strong> Fetches open issues, generates step-by-step resolution plans, auto-writes unit tests, and gives you before/after code diffs to submit as Pull Requests (PRs).
              </div>
              <div className="p-2 bg-[#0a0a0f] rounded-lg border border-slate-800">
                <strong className="text-indigo-400">🛡️ Code Reviewer:</strong> SAST security scanner that checks your code for type errors, memory leaks, and vulnerabilities before you push.
              </div>
              <div className="p-2 bg-[#0a0a0f] rounded-lg border border-slate-800">
                <strong className="text-indigo-400">👤 Contributor Hub:</strong> Fetches live GitHub avatars and profiles, generates verified Shields.io markdown badges, and creates release notes.
              </div>
            </div>
          </div>

          {/* Section 4: Public Hosting Anti-Spam Protection */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
            <h3 className="font-bold text-emerald-200 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 4. Anti-Spam Security for Public Hosting
            </h3>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              If you host this web application online for public users, rate limiters restrict requests per IP address so random visitors cannot exhaust your API quota. Visitors can also supply their own API keys via BYOK mode.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end pt-2 border-t border-slate-800/80">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-colors flex items-center gap-1.5"
          >
            <span>Got it! Start Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
