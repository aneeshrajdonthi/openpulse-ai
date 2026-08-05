import { useState } from 'react';
import type { Repository, ActiveTab } from '../types';
import { Search, Filter, FileText, ChevronRight } from 'lucide-react';

interface ArchitectureGraphViewProps {
  repo: Repository;
  onNavigateTab: (tab: ActiveTab) => void;
}

export function ArchitectureGraphView({ repo, onNavigateTab }: ArchitectureGraphViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');

  const nodes = repo.architectureNodes;
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(nodes[0]?.id || null);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          node.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesComplexity = complexityFilter === 'all' || node.complexity.toLowerCase() === complexityFilter.toLowerCase();
    return matchesSearch && matchesComplexity;
  });

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || filteredNodes[0] || nodes[0];

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'low': return 'bg-emerald-400';
      case 'medium': return 'bg-amber-400';
      case 'high': return 'bg-rose-400';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex flex-col space-y-6 text-slate-100 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Module Architecture Graph</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            AST Dependency topology & module structure for <span className="text-indigo-400 font-mono">{repo.owner}/{repo.name}</span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              placeholder="Filter modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 bg-[#12121c] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 absolute left-3 text-slate-500 pointer-events-none" />
            <select
              value={complexityFilter}
              onChange={(e) => setComplexityFilter(e.target.value)}
              className="h-8 pl-8 pr-3 appearance-none bg-[#12121c] border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value="all">All Complexities</option>
              <option value="low">Low Complexity</option>
              <option value="medium">Medium Complexity</option>
              <option value="high">High Complexity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Grid of Modules */}
        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredNodes.map(node => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? 'bg-indigo-600/10 border-indigo-500/50 shadow-md shadow-indigo-500/10' 
                    : 'bg-[#12121c] border-slate-800 hover:border-slate-700 hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-semibold text-white tracking-wide">{node.label}</span>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{node.description}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                    {node.type}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getComplexityColor(node.complexity)}`} />
                    <span className="text-slate-300 text-[11px] capitalize">{node.complexity} Complexity</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <FileText className="w-3 h-3 text-slate-500" />
                      {node.fileCount} files
                    </span>
                    {node.goodFirstIssueCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                        {node.goodFirstIssueCount} GFI
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Module Inspector Panel */}
        <div className="w-full lg:w-1/3">
          {selectedNode ? (
            <div className="bg-[#12121c] border border-slate-800 rounded-xl p-5 space-y-5 sticky top-20 shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">Module Details</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                    {selectedNode.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-mono">{selectedNode.label}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.05]">
                  {selectedNode.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Files Managed</span>
                  <span className="text-lg font-bold text-white font-mono">{selectedNode.fileCount}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Good First Issues</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">{selectedNode.goodFirstIssueCount}</span>
                </div>
              </div>

              {/* Connections */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Connected Dependencies</span>
                {selectedNode.connections.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.connections.map((conn, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-indigo-300">
                        {conn}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No outgoing module dependencies</span>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => onNavigateTab('issue-studio')}
                className="w-full h-9 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Find Issues in Module</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-[#12121c] border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              Select a module node to inspect properties
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
