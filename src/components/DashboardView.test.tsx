import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardView } from './DashboardView';
import { REPOSITORIES } from '../data/mockData';

describe('DashboardView Component', () => {
  const mockRepo = REPOSITORIES[0];

  it('renders repository owner, name, and description', () => {
    render(
      <DashboardView
        repo={mockRepo}
        onNavigateTab={vi.fn()}
        onSelectIssueToFix={vi.fn()}
      />
    );

    expect(screen.getByText(new RegExp(`${mockRepo.owner} /`, 'i'))).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: mockRepo.name })).toBeInTheDocument();
    expect(screen.getByText(mockRepo.description)).toBeInTheDocument();
  });

  it('displays metrics such as stars, forks, and code health score', () => {
    render(
      <DashboardView
        repo={mockRepo}
        onNavigateTab={vi.fn()}
        onSelectIssueToFix={vi.fn()}
      />
    );

    expect(screen.getByText(`${mockRepo.stars.toLocaleString()} stars`)).toBeInTheDocument();
    expect(screen.getByText(`${mockRepo.forks.toLocaleString()} forks`)).toBeInTheDocument();
    expect(screen.getByText(`${mockRepo.healthScore}%`)).toBeInTheDocument();
    expect(screen.getByText(mockRepo.language)).toBeInTheDocument();
  });

  it('navigates to corresponding tabs when action cards are clicked', async () => {
    const handleNavigate = vi.fn();
    const user = userEvent.setup();

    render(
      <DashboardView
        repo={mockRepo}
        onNavigateTab={handleNavigate}
        onSelectIssueToFix={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: /Architecture Graph/i }));
    expect(handleNavigate).toHaveBeenCalledWith('architecture');

    await user.click(screen.getByRole('button', { name: /AI Issue Studio/i }));
    expect(handleNavigate).toHaveBeenCalledWith('issue-studio');
  });

  it('triggers onSelectIssueToFix when Fix with AI button is clicked', async () => {
    const handleSelectIssue = vi.fn();
    const user = userEvent.setup();

    render(
      <DashboardView
        repo={mockRepo}
        onNavigateTab={vi.fn()}
        onSelectIssueToFix={handleSelectIssue}
      />
    );

    const fixButtons = screen.getAllByRole('button', { name: /Fix with AI/i });
    expect(fixButtons.length).toBeGreaterThan(0);

    await user.click(fixButtons[0]);
    expect(handleSelectIssue).toHaveBeenCalledWith(mockRepo.issues[0].id);
  });
});
