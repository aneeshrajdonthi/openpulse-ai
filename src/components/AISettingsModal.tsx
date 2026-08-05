import React from 'react';
import { X, ShieldCheck, Key, Cpu } from 'lucide-react';
import type { AISettings } from '../types';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onUpdateSettings: (newSettings: AISettings) => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-lg p-6 space-y-6 bg-[#0c101c] border border-indigo-500/30 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">AI Model & Anti-Spam Security</h2>
          </div>
          <p className="text-xs text-gray-400">
            Configure LLM engines, protect API keys, and enforce rate limits for public hosting.
          </p>
        </div>

        {/* AI Model Selection */}
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-200">Active AI Model:</label>
            <select
              value={settings.model}
              onChange={(e) => onUpdateSettings({ ...settings, model: e.target.value as any })}
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-indigo-500 font-sans"
            >
              <option value="gemini-1.5-flash" className="bg-gray-900">Google Gemini 1.5 Flash (Fast & Free Tier)</option>
              <option value="gemini-2.0-flash" className="bg-gray-900">Google Gemini 2.0 Flash (Next-Gen Speed)</option>
              <option value="custom-key" className="bg-gray-900">Bring Your Own API Key (BYOK Mode)</option>
            </select>
          </div>

          {/* User API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" /> Optional User Gemini API Key:
              </label>
              <span className="badge badge-emerald text-[9px]">Encrypted</span>
            </div>
            <input
              type="password"
              value={settings.userApiKey}
              onChange={(e) => onUpdateSettings({ ...settings, userApiKey: e.target.value })}
              placeholder="Paste AIZASy... (Stored in LocalStorage)"
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
            <p className="text-[10px] text-gray-400">
              Entering your own key bypasses public quota limits completely.
            </p>
          </div>

          {/* Anti-Spam Rate Limiter Explanation & Settings */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-500/25 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-indigo-300 font-semibold text-xs">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Public Anti-Spam Guard
              </span>
              <span className="badge badge-emerald text-[9px]">ACTIVE</span>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              When hosted publicly, OpenPulse AI prevents users from exhausting your credits by enforcing:
            </p>
            <ul className="text-[11px] text-gray-400 space-y-1 list-disc pl-4">
              <li><strong className="text-gray-200">Rate Limiter</strong>: Maximum {settings.rateLimitPerMin} AI requests per minute per IP address.</li>
              <li><strong className="text-gray-200">BYOK Option</strong>: Users can supply their own free Gemini key.</li>
              <li><strong className="text-gray-200">AST Response Cache</strong>: Pre-analyzed repository diffs are cached locally to save API calls.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="gradient-btn text-xs h-9 px-4"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
