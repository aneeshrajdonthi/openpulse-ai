import { useState, useEffect } from 'react';
import type { Repository, Contributor } from '../types';
import { Copy, Terminal, Check, Search, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { fetchGitHubUser, fetchRepoContributors } from '../services/githubApi';

interface ContributorHubViewProps {
  repo?: Repository;
}

export function ContributorHubView({ repo }: ContributorHubViewProps) {
  const defaultUser: Contributor = {
    id: 'user-aneesh',
    name: 'Aneesh Raj',
    username: 'aneeshrajdonthi',
    avatar: 'https://avatars.githubusercontent.com/aneeshrajdonthi',
    prsMerged: 24,
    commitsThisMonth: 48,
    linesAdded: 6200,
    linesDeleted: 1400,
    rank: 'Maintainer',
    badges: ['GitHub Verified', 'Maintainer', 'Active OSS Contributor']
  };

  const [contributor, setContributor] = useState<Contributor>(defaultUser);
  const [searchInput, setSearchInput] = useState<string>('aneeshrajdonthi');
  const [repoContributors, setRepoContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [badgeColor, setBadgeColor] = useState('indigo');
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  // Auto-fetch profile for active repo owner or aneeshrajdonthi on mount
  useEffect(() => {
    const initialUsername = repo?.owner || 'aneeshrajdonthi';
    setSearchInput(initialUsername);
    loadUserProfile(initialUsername);

    if (repo?.owner && repo?.name) {
      fetchRepoContributors(repo.owner, repo.name).then(list => {
        if (list.length > 0) setRepoContributors(list);
      });
    }
  }, [repo?.owner, repo?.name]);

  const loadUserProfile = async (username: string) => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const profile = await fetchGitHubUser(username);
      setContributor(profile);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch GitHub profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUserProfile(searchInput);
  };

  const badgeCode = `[![Contributor Rank](https://img.shields.io/badge/Rank-${contributor.rank}-${badgeColor})](https://github.com/${contributor.username})`;
  
  const releaseNotes = `## 🎉 Release Acknowledgements
Special thanks to @${contributor.username} (${contributor.name}) for outstanding contributions!
- Merged **${contributor.prsMerged} Pull Requests**
- Authored **${contributor.commitsThisMonth} Commits** (+${contributor.linesAdded} / -${contributor.linesDeleted} lines)
- Badge Tier: \`${contributor.rank}\``;

  const handleCopy = (text: string, type: 'badge' | 'notes') => {
    navigator.clipboard.writeText(text);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    
    if (type === 'badge') {
      setCopiedBadge(true);
      setTimeout(() => setCopiedBadge(false), 2000);
    } else {
      setCopiedNotes(true);
      setTimeout(() => setCopiedNotes(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 text-slate-100 p-2 md:p-4 font-sans">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Contributor Hub</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Lookup real GitHub profiles, export verified contributor badges & generate release notes
          </p>
        </div>

        {/* GitHub Lookup Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Lookup GitHub username..."
              className="h-9 pl-8 pr-3 bg-[#12121c] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-all w-60"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchInput.trim()}
            className="h-9 px-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
          >
            {loading ? <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-200" /> : <Search className="w-3.5 h-3.5" />}
            <span>Fetch Profile</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* Repo Contributors Quick Selector */}
      {repoContributors.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            {repo?.name} Contributors:
          </span>
          {repoContributors.map(c => (
            <button
              key={c.id}
              onClick={() => {
                setSearchInput(c.username);
                loadUserProfile(c.username);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs transition-colors shrink-0 ${
                contributor.username === c.username
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              <img src={c.avatar} alt={c.username} className="w-4 h-4 rounded-full" />
              <span>@{c.username}</span>
            </button>
          ))}
        </div>
      )}

      {/* Contributor Profile Card */}
      <div className="bg-[#12121c] border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img 
            src={contributor.avatar} 
            alt={contributor.name} 
            className="w-16 h-16 rounded-full bg-slate-800 border-2 border-indigo-500/40 shadow-md object-cover"
            onError={(e) => {
              // Fallback to GitHub avatar URL structure if image load fails
              (e.target as HTMLImageElement).src = `https://github.com/${contributor.username}.png`;
            }}
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-white tracking-tight">{contributor.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {contributor.rank}
              </span>
            </div>
            <a 
              href={`https://github.com/${contributor.username}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-mono"
            >
              @{contributor.username}
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {contributor.badges.map((b, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 border border-white/[0.08]">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">PRs Merged</p>
            <p className="font-bold text-xl text-white font-mono">{contributor.prsMerged}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Commits</p>
            <p className="font-bold text-xl text-white font-mono">{contributor.commitsThisMonth}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Impact</p>
            <p className="font-semibold text-xs font-mono">
              <span className="text-emerald-400">+{contributor.linesAdded.toLocaleString()}</span>{' '}
              <span className="text-rose-400">-{contributor.linesDeleted.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Badge Exporter & Release Notes Generator */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Badge Exporter */}
        <div className="bg-[#12121c] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col space-y-4">
          <h3 className="font-semibold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Verified Badge Exporter
          </h3>
          
          <div className="space-y-3.5 flex-1">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">Shield Color Theme</label>
              <div className="flex space-x-2">
                {['indigo', 'blue', 'green', 'rose', 'amber'].map(color => (
                  <button
                    key={color}
                    onClick={() => setBadgeColor(color)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${badgeColor === color ? 'border-white scale-110 shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'}`}
                    style={{ backgroundColor: color === 'indigo' ? '#6366f1' : color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'rose' ? '#f43f5e' : '#f59e0b' }}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-2">Live Badge Preview</label>
              <div className="p-4 bg-[#0a0a0f] rounded-lg border border-slate-800 flex items-center justify-center">
                <img 
                  src={`https://img.shields.io/badge/Rank-${contributor.rank}-${badgeColor}`} 
                  alt="Badge Preview" 
                  className="shadow"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-xs font-medium text-slate-400 block mb-2">Markdown Code (Embed in GitHub README)</label>
              <div className="relative flex-1">
                <pre className="w-full h-full min-h-[90px] p-3 bg-[#0a0a0f] rounded-lg border border-slate-800 font-mono text-[11px] text-indigo-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {badgeCode}
                </pre>
                <button
                  onClick={() => handleCopy(badgeCode, 'badge')}
                  className="absolute top-2 right-2 p-1.5 bg-[#12121c] border border-slate-700 rounded-md hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1 text-[10px]"
                >
                  {copiedBadge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBadge ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Release Notes Generator */}
        <div className="bg-[#12121c] border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="font-semibold text-sm text-white">Release Notes Generator</h3>
          </div>
          <div className="relative flex-1 flex flex-col">
            <pre className="flex-1 w-full p-4 bg-[#0a0a0f] text-slate-200 rounded-lg border border-slate-800 font-mono text-xs overflow-auto whitespace-pre-wrap leading-relaxed">
              {releaseNotes}
            </pre>
            <button
              onClick={() => handleCopy(releaseNotes, 'notes')}
              className="absolute top-3 right-3 p-1.5 bg-[#12121c] border border-slate-700 rounded-md hover:bg-slate-800 text-slate-300 transition-colors flex items-center gap-1 text-[10px]"
            >
              {copiedNotes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotes ? 'Copied Notes' : 'Copy Release Notes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
