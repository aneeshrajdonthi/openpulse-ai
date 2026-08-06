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
  ArrowRight,
  Copy,
  Check,
  GitCommit
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

  const getFileBasename = (filePath: string) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1] || filePath;
  };

  const getFileDescription = (filePath: string): string => {
    const fn = getFileBasename(filePath).toLowerCase();
    if (fn.includes('dashboard')) return 'Overview stats grid, health score gauge, and top repository issues.';
    if (fn.includes('navbar')) return 'Top app header with repository selector, global search, and settings.';
    if (fn.includes('sidebar')) return 'Slim navigation sidebar for switching views (Dashboard, Architecture, Studio).';
    if (fn.includes('architecture')) return 'System architecture topology pipeline, file cards grid, and tree view.';
    if (fn.includes('issue') || fn.includes('pr')) return 'AI issue resolution studio, resolution steps, and git diff viewer.';
    if (fn.includes('app.')) return 'Root React component managing routing state and active repository.';
    if (fn.includes('types') || fn.includes('index.ts')) return 'TypeScript contract interfaces for Repositories, Issues, and Settings.';
    if (fn.includes('github') || fn.includes('api')) return 'GitHub REST API client fetching repos, directory trees, and issues.';
    if (fn.includes('mock')) return 'Fallback repository dataset for offline demonstration.';
    if (fn.includes('reviewer') || fn.includes('code')) return 'SAST security scanner checking code for vulnerabilities and edge cases.';
    if (fn.includes('modal') || fn.includes('newrepo')) return 'Repository connector modal parsing GitHub URLs.';
    if (fn.includes('setting')) return 'Multi-model LLM configuration modal (Gemini, OpenAI, Claude, Ollama).';
    if (fn.includes('vite')) return 'Vite bundler configuration with Tailwind CSS v4 setup.';
    if (fn.includes('package')) return 'NPM package manifesto listing project dependencies and build scripts.';
    if (fn.includes('css')) return 'Tailwind CSS v4 design system, color tokens, and custom scrollbars.';
    if (fn.includes('contributor')) return 'GitHub contributor stats, release notes generator, and badges.';
    if (fn.includes('sandbox')) return 'Multi-file code editor playground with interactive terminal console.';
    return `Source file implementing logic for ${getFileBasename(filePath)}.`;
  };

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
      description: `User interface components, views, dashboard metrics, and top navigation.`,
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
      description: `Application state management, view routing, and TypeScript interfaces.`,
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
      description: `REST API integration querying GitHub endpoints for repository metadata & issues.`,
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
      description: `Multi-model LLM engine (Gemini, OpenAI, Claude, Ollama) & SAST security scanner.`,
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
      description: `Vite bundler config, Tailwind CSS v4 design tokens, and package manifesto.`,
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
    <div className="flex flex-col space-y-6 text-slate-100 p-2 md:p-4 font-sans max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>Repository Architecture</span>
            <span>/</span>
            <span className="text-indigo-400">{repo.owner}/{repo.name}</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">System Design Topology</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher Tabs */}
          <div className="flex items-center p-1 bg-[#12121c] border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
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
              className="h-8 pl-8 pr-3 bg-[#12121c] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-all w-44"
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      {viewMode === 'graph' ? (
        <div className="relative space-y-4 pl-4 md:pl-6 border-l border-slate-800/80 my-2">
          {systemNodes.map((node) => {
            const isExpanded = expandedLayerId === node.id;
            const mappedFiles = node.mappedFiles || [];

            if (searchQuery.trim() && !node.label.toLowerCase().includes(searchQuery.toLowerCase()) && !node.description.toLowerCase().includes(searchQuery.toLowerCase())) {
              return null;
            }

            return (
              <div key={node.id} className="relative group">
                {/* Connector Node Circle on Timeline */}
                <div className="absolute -left-[23px] md:-left-[31px] top-5 w-3.5 h-3.5 rounded-full bg-[#12121c] border-2 border-indigo-500 group-hover:border-indigo-400 transition-colors flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-indigo-400" />
                </div>

                {/* Layer Card */}
                <div
                  onClick={() => setExpandedLayerId(isExpanded ? null : node.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isExpanded
                      ? 'bg-[#12121c] border-indigo-500/50 shadow-md shadow-indigo-500/5'
                      : 'bg-[#0f0f16] border-slate-800/90 hover:border-slate-700 hover:bg-[#12121c]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-white tracking-tight">{node.label}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.06] capitalize">
                          {node.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{node.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-xs font-mono text-slate-400 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/[0.06]">
                        {mappedFiles.length || node.fileCount} files
                      </span>
                      <div className="w-6 h-6 rounded flex items-center justify-center text-slate-400">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded File Cards Grid */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 cursor-default" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                          <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
                          Source Files in {node.label}
                        </span>
                        <button
                          onClick={() => onNavigateTab('issue-studio')}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Solve Issues</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* File Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {mappedFiles.map((filePath, fIdx) => {
                          const filename = getFileBasename(filePath);
                          const isCopied = copiedFile === filePath;
                          const description = getFileDescription(filePath);

                          return (
                            <div
                              key={fIdx}
                              className="p-3 bg.bg-[#0a0a0e] bg-[#0c0c12] border border-slate-800/80 hover:border-slate-700 rounded-lg transition-all space-y-2 group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 truncate">
                                  <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
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

                              <p className="font-mono text-[10px] text-slate-500 truncate" title={filePath}>
                                {filePath}
                              </p>

                              <p className="text-[11px] text-slate-300 leading-relaxed bg-[#07070a] p-2 rounded border border-slate-800/50">
                                {description}
                              </p>

                              <div className="flex items-center justify-between pt-1 text-[10px]">
                                <span className="text-slate-400 font-mono">
                                  {filename.endsWith('.tsx') ? 'React View' : filename.endsWith('.ts') ? 'TypeScript' : 'Config'}
                                </span>
                                <span className="text-indigo-400 group-hover:underline cursor-pointer flex items-center gap-0.5" onClick={() => onNavigateTab('code-reviewer')}>
                                  <span>Audit SAST</span>
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
              </div>
            );
          })}
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
