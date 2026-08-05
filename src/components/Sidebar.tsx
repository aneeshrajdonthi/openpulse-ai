// Sidebar.tsx
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
    <aside className="w-60 h-[calc(100vh-4rem)] sticky top-16 flex flex-col bg-[#0c0c14] border-r border-white/5 shrink-0">
      <div className="flex-1 overflow-y-auto py-4">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-6 px-3">
            <h3 className="mb-2 px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
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
                    className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors relative ${
                      isActive 
                        ? 'bg-white/5 text-indigo-400' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-indigo-500 rounded-r" />
                    )}
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/10 text-slate-400'
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
      
      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium">AI Engine Online</span>
        </div>
      </div>
    </aside>
  );
}
