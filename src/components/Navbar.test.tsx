import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from './Navbar';
import { REPOSITORIES } from '../data/mockData';
import type { AISettings } from '../types';

describe('Navbar Component', () => {
  const mockAISettings: AISettings = {
    provider: 'google',
    model: 'gemini-2.0-flash',
    userApiKey: '',
    rateLimitPerMin: 10,
    protectionEnabled: true,
  };

  it('renders branding and version tag', () => {
    render(
      <Navbar
        repositories={REPOSITORIES}
        selectedRepo={REPOSITORIES[0]}
        onSelectRepo={vi.fn()}
        onOpenNewRepoModal={vi.fn()}
        aiSettings={mockAISettings}
        onOpenAISettings={vi.fn()}
        onToggleBeginnerGuide={vi.fn()}
        theme="dark"
        onToggleTheme={vi.fn()}
      />
    );

    expect(screen.getByText('OpenPulse AI')).toBeInTheDocument();
    expect(screen.getByText('v2.0')).toBeInTheDocument();
  });

  it('displays the selected repository name', () => {
    render(
      <Navbar
        repositories={REPOSITORIES}
        selectedRepo={REPOSITORIES[0]}
        onSelectRepo={vi.fn()}
        onOpenNewRepoModal={vi.fn()}
        aiSettings={mockAISettings}
        onOpenAISettings={vi.fn()}
        onToggleBeginnerGuide={vi.fn()}
        theme="dark"
        onToggleTheme={vi.fn()}
      />
    );

    expect(screen.getByText(`${REPOSITORIES[0].owner}/${REPOSITORIES[0].name}`)).toBeInTheDocument();
  });

  it('toggles repo dropdown and allows selecting another repo', async () => {
    const handleSelectRepo = vi.fn();
    const user = userEvent.setup();

    render(
      <Navbar
        repositories={REPOSITORIES}
        selectedRepo={REPOSITORIES[0]}
        onSelectRepo={handleSelectRepo}
        onOpenNewRepoModal={vi.fn()}
        aiSettings={mockAISettings}
        onOpenAISettings={vi.fn()}
        onToggleBeginnerGuide={vi.fn()}
        theme="dark"
        onToggleTheme={vi.fn()}
      />
    );

    // Open dropdown
    const repoButton = screen.getByText(`${REPOSITORIES[0].owner}/${REPOSITORIES[0].name}`);
    await user.click(repoButton);

    // Repositories header should be visible
    expect(screen.getByText('Repositories')).toBeInTheDocument();

    // Select second repository
    const secondRepo = REPOSITORIES[1];
    const secondRepoOption = screen.getByRole('button', { name: new RegExp(`${secondRepo.owner}/${secondRepo.name}`, 'i') });
    await user.click(secondRepoOption);

    expect(handleSelectRepo).toHaveBeenCalledWith(secondRepo);
  });

  it('triggers onToggleTheme when the theme toggle button is clicked', async () => {
    const handleToggleTheme = vi.fn();
    const user = userEvent.setup();

    render(
      <Navbar
        repositories={REPOSITORIES}
        selectedRepo={REPOSITORIES[0]}
        onSelectRepo={vi.fn()}
        onOpenNewRepoModal={vi.fn()}
        aiSettings={mockAISettings}
        onOpenAISettings={vi.fn()}
        onToggleBeginnerGuide={vi.fn()}
        theme="dark"
        onToggleTheme={handleToggleTheme}
      />
    );

    const themeButton = screen.getByTitle('Switch to Light Mode');
    await user.click(themeButton);
    expect(handleToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('triggers onOpenAISettings, onToggleBeginnerGuide, and onOpenNewRepoModal', async () => {
    const handleOpenAI = vi.fn();
    const handleGuide = vi.fn();
    const handleNewRepo = vi.fn();
    const user = userEvent.setup();

    render(
      <Navbar
        repositories={REPOSITORIES}
        selectedRepo={REPOSITORIES[0]}
        onSelectRepo={vi.fn()}
        onOpenNewRepoModal={handleNewRepo}
        aiSettings={mockAISettings}
        onOpenAISettings={handleOpenAI}
        onToggleBeginnerGuide={handleGuide}
        theme="dark"
        onToggleTheme={vi.fn()}
      />
    );

    await user.click(screen.getByTitle('AI Settings'));
    expect(handleOpenAI).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Beginner Guide/i }));
    expect(handleGuide).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /Analyze Repo/i }));
    expect(handleNewRepo).toHaveBeenCalledTimes(1);
  });
});
