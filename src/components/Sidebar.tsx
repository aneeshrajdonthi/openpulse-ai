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
}

export function Sidebar({ activeTab, onTabChange, openIssuesCount }: SidebarProps) {
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
    <aside className="w-56 h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col bg-black border-r border-zinc-800 shrink-0 select-none">
      <div className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-5 px-3">
            <h3 className="mb-2 px-2 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">
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
                        ? 'bg-zinc-800/80 text-white font-semibold border border-zinc-700/60 shadow-sm' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 font-mono rounded ${
                        isActive ? 'bg-zinc-700 text-white font-semibold' : 'bg-zinc-800 text-zinc-400'
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
      
      <div className="p-3 border-t border-zinc-800 mt-auto">
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-zinc-400 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>AI Engine Online</span>
        </div>
      </div>
    </aside>
  );
}
