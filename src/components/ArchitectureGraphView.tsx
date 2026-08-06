import { useState } from 'react';
import type { Repository, ActiveTab, TreeNode, ArchNode } from '../types';
import { 
  Folder, 
  FolderOpen, 
  FileCode, 
  ChevronRight, 
  ChevronDown, 
  Network, 
  FolderTree, 
  Search, 
  Info,
  ArrowRight,
  Cpu,
  Layers,
  ArrowDown
} from 'lucide-react';

interface ArchitectureGraphViewProps {
  repo: Repository;
  onNavigateTab: (tab: ActiveTab) => void;
}

export function ArchitectureGraphView({ repo, onNavigateTab }: ArchitectureGraphViewProps) {
  const [viewMode, setViewMode] = useState<'graph' | 'tree'>('graph');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'tree-src': true,
    'tree-components': true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    path: string;
    type: 'folder' | 'file' | 'system';
    description?: string;
    fileSize?: string;
    moduleType?: string;
    connections?: string[];
  } | null>(null);

  // Cleanse raw folder names (like "Public" or "Src") into real System Design Architecture Layers
  const hasRawFolderNodes = repo.architectureNodes.some(n => 
    n.label.toLowerCase() === 'public' || n.label.toLowerCase() === 'src' || n.label.toLowerCase() === 'custom'
  );

  const defaultSystemNodes: ArchNode[] = [
    {
      id: 'node-ui-presentation',
      label: 'UI & Presentation Layer',
      type: 'component',
      fileCount: 8,
      connections: ['State & Data Routing Layer', 'GitHub REST API Client'],
      complexity: 'Medium',
      goodFirstIssueCount: 3,
      description: `Renders interactive UI views, dashboard metrics, & navigation for ${repo.name}.`
    },
    {
      id: 'node-state-routing',
      label: 'State & Data Routing Layer',
      type: 'core',
      fileCount: 4,
      connections: ['GitHub REST API Client'],
      complexity: 'Low',
      goodFirstIssueCount: 1,
      description: `Manages active repository state, tab routing, and TypeScript data contracts.`
    },
    {
      id: 'node-api-client',
      label: 'GitHub REST API Client',
      type: 'api',
      fileCount: 3,
      connections: ['AI & SAST Security Engine'],
      complexity: 'High',
      goodFirstIssueCount: 2,
      description: `Queries GitHub REST API endpoints (/repos, /contents, /issues, /contributors) for ${repo.owner}/${repo.name}.`
    },
    {
      id: 'node-ai-engine',
      label: 'AI & SAST Security Engine',
      type: 'core',
      fileCount: 5,
      connections: ['Build & Asset Pipeline'],
      complexity: 'High',
      goodFirstIssueCount: 2,
      description: `Multi-provider LLM engine (Gemini, OpenAI, Claude, Ollama), diff solver, and SAST code auditor.`
    },
    {
      id: 'node-build-pipeline',
      label: 'Build & Asset Pipeline',
      type: 'config',
      fileCount: 4,
      connections: [],
      complexity: 'Low',
      goodFirstIssueCount: 1,
      description: `Vite bundler setup, Tailwind CSS v4 design system, and TypeScript compilation.`
    }
  ];

  const systemNodes = (!hasRawFolderNodes && repo.architectureNodes.length >= 3)
    ? repo.architectureNodes
    : defaultSystemNodes;

  // Default tree if repo.fileTree is empty
  const defaultTree: TreeNode[] = [
    {
      id: 'tree-src',
      name: 'src',
      type: 'folder',
      path: 'src',
      description: 'Main application source directory containing UI, state, and business logic.',
      children: [
        {
          id: 'tree-components',
          name: 'components',
          type: 'folder',
          path: 'src/components',
          description: 'Modular React UI components and layout views.',
          children: [
            { id: 'f-nav', name: 'Navbar.tsx', type: 'file', path: 'src/components/Navbar.tsx', fileSize: '4.2 KB', moduleType: 'component', description: 'Top navigation bar with repository selector & search.' },
            { id: 'f-side', name: 'Sidebar.tsx', type: 'file', path: 'src/components/Sidebar.tsx', fileSize: '3.1 KB', moduleType: 'component', description: 'Left navigation sidebar for switching views.' },
            { id: 'f-dash', name: 'DashboardView.tsx', type: 'file', path: 'src/components/DashboardView.tsx', fileSize: '5.8 KB', moduleType: 'core', description: 'Main repository overview dashboard.' },
            { id: 'f-arch', name: 'ArchitectureGraphView.tsx', type: 'file', path: 'src/components/ArchitectureGraphView.tsx', fileSize: '7.2 KB', moduleType: 'core', description: 'Interactive System Design flowchart and architectural visualizer.' },
            { id: 'f-issue', name: 'IssuePRStudioView.tsx', type: 'file', path: 'src/components/IssuePRStudioView.tsx', fileSize: '6.4 KB', moduleType: 'core', description: 'AI issue solver & code diff generator.' },
          ]
        },
        {
          id: 'tree-services',
          name: 'services',
          type: 'folder',
          path: 'src/services',
          description: 'External API client integrations.',
          children: [
            { id: 'f-gh-api', name: 'githubApi.ts', type: 'file', path: 'src/services/githubApi.ts', fileSize: '14.8 KB', moduleType: 'api', description: 'Live GitHub REST API client for fetching repos, AST, & issues.' },
          ]
        },
        {
          id: 'tree-types',
          name: 'types',
          type: 'folder',
          path: 'src/types',
          description: 'TypeScript contract interfaces.',
          children: [
            { id: 'f-types', name: 'index.ts', type: 'file', path: 'src/types/index.ts', fileSize: '2.4 KB', moduleType: 'config', description: 'Global TypeScript data structures (Repository, IssueItem, AISettings).' },
          ]
        },
        { id: 'f-app', name: 'App.tsx', type: 'file', path: 'src/App.tsx', fileSize: '4.8 KB', moduleType: 'core', description: 'Application root container & router state.' },
        { id: 'f-main', name: 'main.tsx', type: 'file', path: 'src/main.tsx', fileSize: '0.8 KB', moduleType: 'core', description: 'DOM entry point mounting React root.' },
      ]
    },
    {
      id: 'tree-public',
      name: 'public',
      type: 'folder',
      path: 'public',
      description: 'Static assets, favicon, and public icons.',
      children: [
        { id: 'f-fav', name: 'favicon.svg', type: 'file', path: 'public/favicon.svg', fileSize: '1.2 KB', moduleType: 'config', description: 'Browser tab favicon asset.' },
      ]
    },
    { id: 'f-pkg', name: 'package.json', type: 'file', path: 'package.json', fileSize: '1.4 KB', moduleType: 'config', description: 'NPM package dependencies and build scripts.' },
    { id: 'f-vite', name: 'vite.config.ts', type: 'file', path: 'vite.config.ts', fileSize: '0.6 KB', moduleType: 'config', description: 'Vite & Tailwind CSS v4 bundler configuration.' },
  ];

  const fileTree = (repo.fileTree && repo.fileTree.length > 0) ? repo.fileTree : defaultTree;

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const activeItem = selectedItem || {
    name: systemNodes[0]?.label || 'UI & Presentation Layer',
    path: `architecture/${systemNodes[0]?.id || 'ui-presentation'}`,
    type: 'system' as const,
    description: systemNodes[0]?.description || `Renders interactive UI views, dashboard metrics, & navigation for ${repo.name}.`,
    fileSize: `${systemNodes[0]?.fileCount || 8} files`,
    moduleType: systemNodes[0]?.type || 'component',
    connections: systemNodes[0]?.connections || ['State & Data Routing Layer', 'GitHub REST API Client']
  };

  const renderTreeNodes = (nodes: TreeNode[], depth = 0) => {
    return nodes.map(node => {
      const isFolder = node.type === 'folder';
      const isExpanded = !!expandedFolders[node.id];
      const isSelected = activeItem.path === node.path;

      if (searchQuery.trim()) {
        const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              node.path.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch && !isFolder) return null;
      }

      return (
        <div key={node.id} className="select-none">
          <div
            onClick={() => {
              if (isFolder) toggleFolder(node.id);
              setSelectedItem({
                name: node.name,
                path: node.path,
                type: node.type,
                description: node.description || `${isFolder ? 'Folder' : 'File'} at ${node.path}`,
                fileSize: node.fileSize || (isFolder ? 'Directory' : '1.5 KB'),
                moduleType: node.moduleType || (isFolder ? 'core' : 'component')
              });
            }}
            style={{ paddingLeft: `${depth * 18 + 12}px` }}
            className={`flex items-center justify-between py-1.5 pr-3 rounded-lg text-xs cursor-pointer transition-colors ${
              isSelected 
                ? 'bg-indigo-600/20 text-white font-medium border border-indigo-500/40' 
                : 'text-slate-300 hover:bg-white/[0.04]'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              {isFolder ? (
                <>
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  {isExpanded ? (
                    <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </>
              ) : (
                <>
                  <span className="w-3.5 h-3.5 shrink-0" />
                  <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                </>
              )}
              <span className={`font-mono truncate ${isFolder ? 'font-semibold text-white' : ''}`}>
                {node.name}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {node.moduleType && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                  {node.moduleType}
                </span>
              )}
              {node.fileSize && (
                <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                  {node.fileSize}
                </span>
              )}
            </div>
          </div>

          {isFolder && isExpanded && node.children && (
            <div className="space-y-0.5 mt-0.5">
              {renderTreeNodes(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col space-y-6 text-slate-100 p-2 md:p-4 font-sans">
      {/* Educational Purpose Banner */}
      <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-indigo-300 font-semibold text-xs">
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            Why use System Architecture Topology instead of plain GitHub?
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
            System Design Topology
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          GitHub only shows a plain list of folders. OpenPulse AI parses your codebase's <strong>System Architecture Layers</strong> (UI Layer ➔ State Routing ➔ REST API Client ➔ AI & SAST Engine ➔ Build Pipeline) and displays a directional data flow diagram so you understand how data flows through the application.
        </p>
      </div>

      {/* Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">System Architecture & Data Flow</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Architectural topology flow for <span className="text-indigo-400 font-mono">{repo.owner}/{repo.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher Tabs */}
          <div className="flex items-center p-1 bg-[#12121c] border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'graph'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>System Flowchart</span>
            </button>
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === 'tree'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Directory Tree</span>
            </button>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search architecture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 bg-[#12121c] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-all w-48"
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Flowchart or Tree View */}
        <div className="w-full lg:w-2/3 bg-[#12121c] border border-slate-800 rounded-xl p-5 shadow-xl min-h-[420px] flex flex-col justify-between">
          {viewMode === 'graph' ? (
            /* System Architecture Flowchart (Data Flow Pipeline) */
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between px-3 py-2 bg-[#0a0a0f] border border-slate-800 rounded-lg text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                  <Layers className="w-4 h-4" /> System Design Data Flow Diagram
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Low Coupling • High Cohesion
                </span>
              </div>

              {/* Flowchart Nodes */}
              <div className="flex flex-col space-y-3 py-2">
                {systemNodes.map((node, idx) => {
                  const isSelected = activeItem.name === node.label;
                  return (
                    <div key={node.id} className="flex flex-col items-center space-y-2">
                      <div
                        onClick={() => setSelectedItem({
                          name: node.label,
                          path: `architecture/${node.id}`,
                          type: 'system',
                          description: node.description,
                          fileSize: `${node.fileCount} files`,
                          moduleType: node.type,
                          connections: node.connections
                        })}
                        className={`w-full p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                            : 'bg-[#0a0a0f] border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            0{idx + 1}
                          </div>
                          <div>
                            <span className="text-xs font-bold font-mono text-white tracking-wide">{node.label}</span>
                            <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">{node.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                            {node.type}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                            {node.fileCount} files
                          </span>
                        </div>
                      </div>

                      {/* Directional Connector Arrow */}
                      {idx < systemNodes.length - 1 && (
                        <div className="flex items-center justify-center text-indigo-400/60 my-0.5">
                          <ArrowDown className="w-4 h-4 animate-pulse" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Directory Tree Mode */
            <div className="flex-1 space-y-1 overflow-y-auto max-h-[500px]">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0f] border border-slate-800 rounded-lg text-xs font-mono font-bold text-white mb-2">
                <Folder className="w-4 h-4 text-indigo-400" />
                <span>{repo.owner} / {repo.name} (Root File Tree)</span>
              </div>
              {renderTreeNodes(fileTree)}
            </div>
          )}
        </div>

        {/* Right Column: Node Inspector Panel */}
        <div className="w-full lg:w-1/3">
          <div className="bg-[#12121c] border border-slate-800 rounded-xl p-5 space-y-5 sticky top-20 shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> Layer Inspector
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                  {activeItem.type}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono truncate">{activeItem.name}</h3>
              <p className="text-xs font-mono text-indigo-300 mt-1 truncate">{activeItem.path}</p>
            </div>

            <div className="p-3 bg-[#0a0a0f] rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1 leading-relaxed">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Layer Responsibilities</span>
              <p>{activeItem.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-800 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Managed Files</span>
                <span className="text-sm font-bold text-white font-mono">{activeItem.fileSize}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Layer Type</span>
                <span className="text-sm font-bold text-indigo-400 font-mono capitalize">{activeItem.moduleType || 'core'}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('issue-studio')}
              className="w-full h-9 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Solve Open Issues in {activeItem.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
