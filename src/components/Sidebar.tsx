import { 
  LayoutDashboard, 
  Layers, 
  Target, 
  GitMerge, 
  Users, 
  Terminal
} from 'lucide-react';
import type { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  openIssuesCount: number;
  theme?: 'dark' | 'light';
}

export function Sidebar({ activeTab, onTabChange, openIssuesCount, theme = 'dark' }: SidebarProps) {
  const isLight = theme === 'light';

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'architecture' as ActiveTab, label: 'Architecture', icon: Layers },
      ]
    },
    {
      title: 'Development',
      items: [
        { id: 'issue-studio' as ActiveTab, label: 'Issue Studio', icon: Target, badge: openIssuesCount > 0 ? openIssuesCount : undefined },
        { id: 'code-reviewer' as ActiveTab, label: 'Code Reviewer', icon: GitMerge },
        { id: 'sandbox' as ActiveTab, label: 'Sandbox', icon: Terminal },
      ]
    },
    {
      title: 'Community',
      items: [
        { id: 'contributor-hub' as ActiveTab, label: 'Contributor Hub', icon: Users },
      ]
    }
  ];

  return (
    <aside className={`w-56 h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col border-r shrink-0 select-none transition-colors ${
      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black border-zinc-800 text-zinc-200'
    }`}>
      <div className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-5 px-3">
            <h3 className={`mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider font-mono ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors relative ${
                      isActive 
                        ? isLight ? 'bg-white text-slate-900 font-bold shadow-sm border border-slate-200' : 'bg-zinc-800/80 text-white font-semibold border border-zinc-700/60 shadow-sm'
                        : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? (isLight ? 'text-slate-900' : 'text-white') : (isLight ? 'text-slate-500' : 'text-zinc-400')}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 font-mono rounded ${
                        isActive 
                          ? isLight ? 'bg-slate-900 text-white font-bold' : 'bg-zinc-700 text-white font-semibold'
                          : isLight ? 'bg-slate-200 text-slate-700' : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className={`p-3 border-t mt-auto ${isLight ? 'border-slate-200' : 'border-zinc-800'}`}>
        <div className={`flex items-center gap-2 px-2 py-1 text-xs font-mono ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>AI Engine Online</span>
        </div>
      </div>
    </aside>
  );
}
