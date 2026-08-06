import React from 'react';
import { X, ShieldCheck, Key, Cpu, Sparkles, Server } from 'lucide-react';
import type { AISettings, AIProvider } from '../types';

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

  const currentProvider = settings.provider || 'google';

  const providerModels: Record<AIProvider, Array<{ id: string; name: string }>> = {
    google: [
      { id: 'gemini-2.0-flash', name: 'Google Gemini 2.0 Flash (Recommended & Fast)' },
      { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro (Deep Code Reasoning)' },
    ],
    openai: [
      { id: 'gpt-4o', name: 'OpenAI GPT-4o (Omni High Reasoning)' },
      { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o-mini (Lightweight & Super Fast)' },
      { id: 'o3-mini', name: 'OpenAI o3-mini (Advanced STEM Reasoning)' },
    ],
    anthropic: [
      { id: 'claude-3-5-sonnet', name: 'Anthropic Claude 3.5 Sonnet (Best Coding LLM)' },
      { id: 'claude-3-haiku', name: 'Anthropic Claude 3 Haiku (Fast & Minimal Cost)' },
    ],
    ollama: [
      { id: 'llama-3.2', name: 'Ollama Llama 3.2 (Local Machine / Offline)' },
      { id: 'deepseek-r1-local', name: 'DeepSeek R1 Local (Offline Code Model)' },
      { id: 'custom-local', name: 'Custom Local LLM Endpoint (LocalAI / vLLM)' },
    ],
  };

  const handleProviderChange = (newProvider: AIProvider) => {
    const defaultModel = providerModels[newProvider][0].id;
    onUpdateSettings({
      ...settings,
      provider: newProvider,
      model: defaultModel,
    });
  };

  const getKeyPlaceholder = () => {
    switch (currentProvider) {
      case 'google': return 'Paste Google Gemini Key (AIzaSy...)';
      case 'openai': return 'Paste OpenAI Key (sk-proj-...)';
      case 'anthropic': return 'Paste Anthropic Key (sk-ant-...)';
      case 'ollama': return 'No API Key required for local Ollama';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-sans">
      <div className="w-full max-w-lg p-6 space-y-5 bg-[#12121c] border border-slate-800 rounded-xl shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white tracking-tight">AI Provider & API Key Settings</h2>
          </div>
          <p className="text-xs text-slate-400">
            Use Google Gemini, OpenAI GPT-4o, Anthropic Claude, or run your own Local LLM (Ollama).
          </p>
        </div>

        {/* AI Provider Selection Tabs */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-2">Select AI Model Provider:</label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#0a0a0f] rounded-lg border border-slate-800">
              {[
                { id: 'google' as AIProvider, label: 'Gemini' },
                { id: 'openai' as AIProvider, label: 'OpenAI' },
                { id: 'anthropic' as AIProvider, label: 'Claude' },
                { id: 'ollama' as AIProvider, label: 'Local/Ollama' },
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleProviderChange(p.id)}
                  className={`py-1.5 px-2 rounded-md font-semibold text-[11px] transition-colors ${
                    currentProvider === p.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model Dropdown */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Active Model:</label>
            <select
              value={settings.model}
              onChange={(e) => onUpdateSettings({ ...settings, model: e.target.value })}
              className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.1] rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-sans cursor-pointer text-xs"
            >
              {providerModels[currentProvider].map(m => (
                <option key={m.id} value={m.id} className="bg-[#12121c] text-white">
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* User API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bring Your Own API Key (BYOK):</span>
              </label>
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Client Encrypted
              </span>
            </div>
            <input
              type="password"
              value={settings.userApiKey}
              onChange={(e) => onUpdateSettings({ ...settings, userApiKey: e.target.value })}
              placeholder={getKeyPlaceholder()}
              disabled={currentProvider === 'ollama'}
              className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.1] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs disabled:opacity-50"
            />
            <p className="text-[10px] text-slate-400">
              Entering your own key bypasses public quota limits completely and runs queries directly under your subscription.
            </p>
          </div>

          {/* Custom Endpoint Input for Ollama / Local */}
          {currentProvider === 'ollama' && (
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" />
                <span>Local Server Endpoint URL:</span>
              </label>
              <input
                type="text"
                value={settings.customEndpoint || 'http://localhost:11434/v1'}
                onChange={(e) => onUpdateSettings({ ...settings, customEndpoint: e.target.value })}
                placeholder="http://localhost:11434/v1"
                className="w-full h-9 px-3 bg-white/[0.04] border border-white/[0.1] rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Public Anti-Spam Security Guard */}
          <div className="p-3.5 bg-indigo-950/30 border border-indigo-500/30 rounded-lg space-y-2 text-xs">
            <div className="flex items-center justify-between text-indigo-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Anti-Spam & Cost Mitigation Active
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PROTECTED
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              When hosting OpenPulse AI publicly, your API cost is protected:
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4">
              <li><strong className="text-slate-200">Rate Limiter</strong>: Capped at {settings.rateLimitPerMin} AI requests/min per IP address.</li>
              <li><strong className="text-slate-200">Multi-Model BYOK</strong>: Users can connect their own OpenAI, Claude, or Gemini key.</li>
              <li><strong className="text-slate-200">Local Cache</strong>: AST tree parsing & diffs are cached locally to save API tokens.</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save & Apply AI Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
