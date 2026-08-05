import React from 'react';
import { X, Sparkles, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-2xl p-6 md:p-8 space-y-6 bg-[#0c101c] border border-indigo-500/30 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="badge badge-indigo text-xs">Beginner Friendly Guide</span>
            <span className="badge badge-emerald text-xs">ELI5 Mode</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">
            What is OpenPulse AI & Why is it Valuable for Your Career?
          </h2>
          <p className="text-xs text-gray-400">
            A simple, step-by-step guide with zero complex jargon.
          </p>
        </div>

        {/* Concept 1 */}
        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> 1. What is "Open Source" & Why Does it Matter?
            </h3>
            <p>
              Big companies like Google, Facebook, and Microsoft publish their code publicly so developers around the world can use and improve it. When you contribute code fixes (called <strong>Pull Requests</strong> or <strong>PRs</strong>) to major projects like React or Next.js, recruiters and tech companies view you as a top-tier engineer.
            </p>
          </div>

          {/* Concept 2 */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> 2. What Does OpenPulse AI Do For You?
            </h3>
            <p>
              When beginners try to contribute to big open-source projects, they get overwhelmed by thousands of files. OpenPulse AI solves this with 4 main tools:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-gray-400">
              <li><strong className="text-indigo-300">Repo Architecture Map</strong>: A visual map showing you around the codebase so you know exactly which files to edit.</li>
              <li><strong className="text-purple-300">Issue-to-PR Studio</strong>: Picks real open bugs and uses AI to generate step-by-step instructions and code fixes for you to submit.</li>
              <li><strong className="text-cyan-300">Code Reviewer</strong>: Scans your code for security flaws before you submit it.</li>
              <li><strong className="text-emerald-300">Contributor Badges</strong>: Gives you cool SVG badges to put on your GitHub profile to showcase your contributions to employers!</li>
            </ul>
          </div>

          {/* Concept 3 */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-2">
            <h3 className="font-bold text-indigo-200 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 3. Which AI Model is Used & Can People Spam Your Account?
            </h3>
            <p>
              We use <strong>Google Gemini (Gemini 1.5 Flash / 2.0 Flash)</strong>. To prevent people from spamming your AI key if you host this project online:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-gray-300">
              <li><strong>Rate Limiting</strong>: Public visitors are restricted to 10 requests/minute.</li>
              <li><strong>BYOK (Bring Your Own Key)</strong>: Visitors can paste their own free Gemini API key in settings.</li>
              <li><strong>Smart Caching</strong>: Analyzed repository AST diffs are saved locally so repeat clicks don't re-trigger AI calls.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            onClick={onClose}
            className="gradient-btn text-xs py-2 px-4"
          >
            Got It! Take Me to the App <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
