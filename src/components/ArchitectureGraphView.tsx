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
  ArrowDown,
  Copy,
  Check
} from 'lucide-react';

interface ArchitectureGraphViewProps {
  repo: Repository;
  onNavigateTab: (tab: ActiveTab) => void;
}

export function ArchitectureGraphView({ repo, onNavigateTab }: ArchitectureGraphViewProps) {
  const [viewMode, setViewMode] = useState<'graph' | 'tree'>('graph');
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>('node-ui-presentation');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'tree-src': true,
    'tree-components': true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(text);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Helper to extract clean file basename (e.g. "DashboardView.tsx" from "src/components/DashboardView.tsx")
  const getFileBasename = (filePath: string) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1] || filePath;
  };

  // Plain English file descriptions explaining what each file contains and its role
  const getFileDescription = (filePath: string): string => {
    const fn = getFileBasename(filePath).toLowerCase();
    if (fn.includes('dashboard')) return 'Renders overview metrics, health score gauge, quick actions, and top open issues.';
    if (fn.includes('navbar')) return 'Top navigation header containing active repo selector, global search, and AI settings.';
    if (fn.includes('sidebar')) return 'Left-hand slim sidebar for tab routing (Dashboard, Architecture, Studio, Auditor, Sandbox).';
    if (fn.includes('architecture')) return 'Interactive System Design flowchart, expandable file cards, and directory tree.';
    if (fn.includes('issue') || fn.includes('pr')) return 'AI-assisted GitHub issue solver, resolution checklist, & live git diff generator.';
    if (fn.includes('app.')) return 'Root React app container managing global state, routing, and modal triggers.';
    if (fn.includes('types') || fn.includes('index.ts')) return 'TypeScript contract interfaces for Repository, ArchNode, Issues, & AISettings.';
    if (fn.includes('github') || fn.includes('api')) return 'Live REST API client fetching repos, AST trees, issues, profiles, & contributors.';
    if (fn.includes('mock')) return 'Fallback mock data repository store and offline demo records.';
    if (fn.includes('reviewer') || fn.includes('code')) return 'SAST security auditor scanning code files for vulnerability risks & type safety.';
    if (fn.includes('modal') || fn.includes('newrepo')) return 'Connects new GitHub repositories via URL parsing & automated verification.';
    if (fn.includes('setting')) return 'Multi-model LLM provider selector (Gemini, OpenAI, Claude, Ollama) with BYOK support.';
    if (fn.includes('vite')) return 'Vite bundler configuration with React and Tailwind CSS v4 integration.';
    if (fn.includes('package')) return 'NPM package manifesto listing project dependencies, Lucide icons, & build scripts.';
    if (fn.includes('css')) return 'Tailwind CSS v4 design system tokens, dark slate theme, & custom scrollbars.';
    if (fn.includes('contributor')) return 'GitHub profile search bar, release notes generator, & Shields.io verified badges.';
    if (fn.includes('sandbox')) return 'Interactive multi-file code editor playground with dark terminal execution console.';
    return `Source file implementing core domain logic for ${getFileBasename(filePath)}.`;
  };

  // Cleanse raw folder names (like "Public" or "Src") into real System Design Architecture Layers
  const hasRawFolderNodes = repo.architectureNodes.some(n => 
    n.label.toLowerCase() === 'public' || n.label.toLowerCase() === 'src' || n.label.toLowerCase() === 'custom'
  );

  const defaultSystemNodes: ArchNode[] = [
    {
      id: 'node-ui-presentation',
      label: 'UI & Presentation Layer',
      type: 'component',
      fileCount: 5,
      connections: ['State & Data Routing Layer', 'GitHub REST API Client'],
      complexity: 'Medium',
      goodFirstIssueCount: 3,
      description: `Renders interactive UI views, dashboard metrics, & navigation components for ${repo.name}.`,
      mappedFiles: [
        'src/components/DashboardView.tsx',
        'src/components/Navbar.tsx',
        'src/components/Sidebar.tsx',
        'src/components/ArchitectureGraphView.tsx',
        'src/components/IssuePRStudioView.tsx'
      ]
    },
    {
      id: 'node-state-routing',
      label: 'State & Data Routing Layer',
      type: 'core',
      fileCount: 3,
      connections: ['GitHub REST API Client'],
      complexity: 'Low',
      goodFirstIssueCount: 1,
      description: `Manages active repository state, tab routing, and TypeScript data contracts.`,
      mappedFiles: [
        'src/App.tsx',
        'src/types/index.ts',
        'src/main.tsx'
      ]
    },
    {
      id: 'node-api-client',
      label: 'GitHub REST API Client',
      type: 'api',
      fileCount: 2,
      connections: ['AI & SAST Security Engine'],
      complexity: 'High',
      goodFirstIssueCount: 2,
      description: `Queries GitHub REST API endpoints (/repos, /contents, /issues, /contributors) for ${repo.owner}/${repo.name}.`,
      mappedFiles: [
        'src/services/githubApi.ts',
        'src/data/mockData.ts'
      ]
    },
    {
      id: 'node-ai-engine',
      label: 'AI & SAST Security Engine',
      type: 'core',
      fileCount: 3,
      connections: ['Build & Asset Pipeline'],
      complexity: 'High',
      goodFirstIssueCount: 2,
      description: `Multi-provider LLM engine (Gemini, OpenAI, Claude, Ollama), diff solver, and SAST code auditor.`,
      mappedFiles: [
        'src/components/CodeReviewerView.tsx',
        'src/components/NewRepoModal.tsx',
        'src/components/AISettingsModal.tsx'
      ]
    },
    {
      id: 'node-build-pipeline',
      label: 'Build & Asset Pipeline',
      type: 'config',
      fileCount: 4,
      connections: [],
      complexity: 'Low',
      goodFirstIssueCount: 1,
      description: `Vite bundler setup, Tailwind CSS v4 design system, and TypeScript compilation.`,
      mappedFiles: [
        'vite.config.ts',
        'package.json',
        'src/index.css',
        'tsconfig.json'
      ]
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

  const renderTreeNodes = (nodes: TreeNode[], depth = 0) => {
    return nodes.map(node => {
      const isFolder = node.type === 'folder';
      const isExpanded = !!expandedFolders[node.id];

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
            }}
            style={{ paddingLeft: `${depth * 18 + 12}px` }}
            className="flex items-center justify-between py-2 pr-3 rounded-lg text-xs cursor-pointer text-slate-300 hover:bg-white/[0.04] transition-colors"
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
    <div className="flex flex-col space-y-6 text-slate-100 p-2 md:p-4 font-sans max-w-7xl mx-auto w-full">
      {/* Educational Purpose Banner */}
      <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-indigo-300 font-semibold text-xs">
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            Interactive System Design Architecture Diagram
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
            System Design Topology
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Click on any <strong>System Layer Card</strong> below to expand its file cards grid! Each file card displays its <strong>exact role, content breakdown, and purpose</strong>.
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
              <span>Interactive System Flowchart</span>
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
              <span>Directory Tree View</span>
            </button>
          </div>

          {/* Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search layers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 pr-3 bg-[#12121c] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-all w-48"
            />
          </div>
        </div>
      </div>

      {/* Main View Container */}
      {viewMode === 'graph' ? (
        /* Full-Width Interactive Accordion System Architecture Flowchart */
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#12121c] border border-slate-800 rounded-xl text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2 text-indigo-400 font-semibold">
              <Layers className="w-4 h-4" /> System Design Pipeline ({systemNodes.length} Layers)
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Low Coupling • High Cohesion Architecture
            </span>
          </div>

          {/* Interactive Expandable Layer Cards */}
          <div className="space-y-3">
            {systemNodes.map((node, idx) => {
              const isExpanded = expandedLayerId === node.id;
              const mappedFiles = node.mappedFiles || [];

              if (searchQuery.trim() && !node.label.toLowerCase().includes(searchQuery.toLowerCase()) && !node.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                return null;
              }

              return (
                <div key={node.id} className="flex flex-col items-center space-y-2">
                  {/* Layer Header Card */}
                  <div
                    onClick={() => setExpandedLayerId(isExpanded ? null : node.id)}
                    className={`w-full p-4 rounded-xl border cursor-pointer transition-all ${
                      isExpanded
                        ? 'bg-indigo-600/10 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                        : 'bg-[#12121c] border-slate-800 hover:border-slate-700 hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          0{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white tracking-wide">{node.label}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-white/[0.05] text-indigo-300 border border-white/[0.08]">
                              {node.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{node.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {mappedFiles.length || node.fileCount} mapped files
                        </span>
                        <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Grid of Mapped Source File Cards */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-indigo-500/20 space-y-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" /> Source File Roles & Content Descriptions ({mappedFiles.length})
                          </span>
                          <button
                            onClick={() => onNavigateTab('issue-studio')}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                          >
                            <span>Solve Issues in {node.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* File Cards Grid with Content Descriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {mappedFiles.map((filePath, fIdx) => {
                            const filename = getFileBasename(filePath);
                            const isCopied = copiedFile === filePath;
                            const description = getFileDescription(filePath);

                            return (
                              <div
                                key={fIdx}
                                className="p-3.5 bg-[#0a0a0f] border border-slate-800 hover:border-indigo-500/40 rounded-xl transition-all flex flex-col justify-between space-y-2.5 group"
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 truncate">
                                      <FileCode className="w-4 h-4 text-indigo-400 shrink-0" />
                                      <span className="font-mono text-xs font-bold text-white truncate" title={filename}>
                                        {filename}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => copyToClipboard(filePath)}
                                      title="Copy file path"
                                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors shrink-0"
                                    >
                                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>

                                  <span className="font-mono text-[10px] text-slate-500 block truncate" title={filePath}>
                                    {filePath}
                                  </span>

                                  {/* Plain English File Content Description */}
                                  <p className="text-[11px] text-slate-300 leading-snug bg-white/[0.02] p-2 rounded-lg border border-white/[0.04]">
                                    {description}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px]">
                                  <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-indigo-300 font-sans border border-white/[0.08]">
                                    {filename.endsWith('.tsx') ? 'React UI Component' : filename.endsWith('.ts') ? 'TypeScript Logic' : 'Config File'}
                                  </span>
                                  <span className="text-indigo-400 group-hover:underline cursor-pointer flex items-center gap-0.5" onClick={() => onNavigateTab('code-reviewer')}>
                                    <span>Review SAST</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Flowchart Connector Arrow */}
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
        /* Full-Width Directory Tree Mode */
        <div className="bg-[#12121c] border border-slate-800 rounded-xl p-5 shadow-xl min-h-[450px]">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0f] border border-slate-800 rounded-lg text-xs font-mono font-bold text-white mb-3">
            <Folder className="w-4 h-4 text-indigo-400" />
            <span>{repo.owner} / {repo.name} (Root Directory Tree)</span>
          </div>
          {renderTreeNodes(fileTree)}
        </div>
      )}
    </div>
  );
}
