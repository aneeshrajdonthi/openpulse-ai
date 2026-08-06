import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ArchitectureGraphView } from './components/ArchitectureGraphView';
import { IssuePRStudioView } from './components/IssuePRStudioView';
import { CodeReviewerView } from './components/CodeReviewerView';
import { ContributorHubView } from './components/ContributorHubView';
import { LiveSandboxView } from './components/LiveSandboxView';
import { NewRepoModal } from './components/NewRepoModal';
import { AISettingsModal } from './components/AISettingsModal';
import { BeginnerGuideModal } from './components/BeginnerGuideModal';
import { REPOSITORIES } from './data/mockData';
import type { Repository, ActiveTab, AISettings } from './types';

const App: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>(REPOSITORIES);
  const [selectedRepoId, setSelectedRepoId] = useState<string>(REPOSITORIES[0]?.id || '');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedIssueId, setSelectedIssueId] = useState<string | undefined>(undefined);

  const [isNewRepoModalOpen, setIsNewRepoModalOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isBeginnerGuideOpen, setIsBeginnerGuideOpen] = useState(false);

  const [aiSettings, setAiSettings] = useState<AISettings>({
    provider: 'google',
    model: 'gemini-2.0-flash',
    userApiKey: '',
    rateLimitPerMin: 10,
    protectionEnabled: true,
  });

  const selectedRepo = repositories.find(repo => repo.id === selectedRepoId) || repositories[0];

  const handleSelectIssueToFix = (issueId: string) => {
    setSelectedIssueId(issueId);
    setActiveTab('issue-studio');
  };

  const handleAddRepo = (newRepo: Repository) => {
    setRepositories(prev => [newRepo, ...prev]);
    setSelectedRepoId(newRepo.id);
    setIsNewRepoModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0f] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <Navbar 
        repositories={repositories}
        selectedRepo={selectedRepo}
        onSelectRepo={(repo: Repository) => setSelectedRepoId(repo.id)}
        onOpenNewRepoModal={() => setIsNewRepoModalOpen(true)}
        aiSettings={aiSettings}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        onToggleBeginnerGuide={() => setIsBeginnerGuideOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          openIssuesCount={selectedRepo.openIssues} 
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {activeTab === 'dashboard' && (
              <DashboardView 
                repo={selectedRepo} 
                onNavigateTab={setActiveTab}
                onSelectIssueToFix={handleSelectIssueToFix}
              />
            )}
            {activeTab === 'architecture' && (
              <ArchitectureGraphView repo={selectedRepo} onNavigateTab={setActiveTab} />
            )}
            {activeTab === 'issue-studio' && (
              <IssuePRStudioView repo={selectedRepo} selectedIssueId={selectedIssueId} />
            )}
            {activeTab === 'code-reviewer' && <CodeReviewerView repo={selectedRepo} />}
            {activeTab === 'contributor-hub' && <ContributorHubView repo={selectedRepo} />}
            {activeTab === 'sandbox' && <LiveSandboxView />}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 bg-[#0a0a0f] py-4 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} OpenPulse AI. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <NewRepoModal 
        isOpen={isNewRepoModalOpen} 
        onClose={() => setIsNewRepoModalOpen(false)} 
        onAddRepo={handleAddRepo} 
      />
      <AISettingsModal isOpen={isAISettingsOpen} onClose={() => setIsAISettingsOpen(false)} settings={aiSettings} onUpdateSettings={setAiSettings} />
      <BeginnerGuideModal isOpen={isBeginnerGuideOpen} onClose={() => setIsBeginnerGuideOpen(false)} />
    </div>
  );
}

export default App;
