import { useState } from 'react';
import { Copy, Terminal, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONTRIBUTORS_LIST } from '../data/mockData';

export function ContributorHubView() {
  const selectedContributor = CONTRIBUTORS_LIST[0];
  const [badgeColor, setBadgeColor] = useState('indigo');
  const [copiedBadge, setCopiedBadge] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  const badgeCode = `[![Contributor Rank](https://img.shields.io/badge/Rank-${selectedContributor.rank}-${badgeColor})](https://example.com/u/${selectedContributor.username})`;
  
  const releaseNotes = `## Thanks to our contributors!
We'd like to thank @${selectedContributor.username} for their contributions this release.
- Merged ${selectedContributor.prsMerged} PRs
- Added ${selectedContributor.commitsThisMonth} commits`;

  const handleCopy = (text: string, type: 'badge' | 'notes') => {
    navigator.clipboard.writeText(text);
    confetti({
      particleCount: 100,
      spread: 70,
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
    <div className="flex flex-col h-full space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contributor Hub</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage profiles and generate assets
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm flex items-center space-x-6">
        <img 
          src={selectedContributor.avatar} 
          alt={selectedContributor.name} 
          className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 dark:border-gray-700"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold">{selectedContributor.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
              {selectedContributor.rank}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">@{selectedContributor.username}</p>
          
          <div className="flex items-center space-x-6 mt-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">PRs Merged</p>
              <p className="font-semibold text-lg">{selectedContributor.prsMerged}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Commits</p>
              <p className="font-semibold text-lg">{selectedContributor.commitsThisMonth}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Lines</p>
              <p className="font-semibold text-lg text-green-600 dark:text-green-400">
                +{selectedContributor.linesAdded || 1205} <span className="text-rose-600 dark:text-rose-400">-{selectedContributor.linesDeleted || 340}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-4">Badge Exporter</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Color Theme</label>
              <div className="flex space-x-2">
                {['indigo', 'blue', 'green', 'rose', 'amber'].map(color => (
                  <button
                    key={color}
                    onClick={() => setBadgeColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${badgeColor === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Preview</label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <img src={`https://img.shields.io/badge/Rank-${selectedContributor.rank}-${badgeColor}`} alt="Badge Preview" />
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Markdown</label>
              <div className="relative flex-1">
                <pre className="w-full h-full min-h-[100px] p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-600 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {badgeCode}
                </pre>
                <button
                  onClick={() => handleCopy(badgeCode, 'badge')}
                  className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {copiedBadge ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm flex flex-col">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold">Release Notes Generator</h3>
          </div>
          <div className="relative flex-1 flex flex-col">
            <pre className="flex-1 w-full p-4 bg-gray-900 text-gray-100 rounded-md border border-gray-800 font-mono text-sm overflow-auto whitespace-pre-wrap">
              {releaseNotes}
            </pre>
            <button
              onClick={() => handleCopy(releaseNotes, 'notes')}
              className="absolute top-3 right-3 p-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 transition-colors"
            >
              {copiedNotes ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
