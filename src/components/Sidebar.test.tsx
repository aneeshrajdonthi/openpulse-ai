import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';

describe('Sidebar Component', () => {
  it('renders all navigation categories and items', () => {
    render(
      <Sidebar
        activeTab="dashboard"
        onTabChange={vi.fn()}
        openIssuesCount={5}
      />
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Architecture/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Issue Studio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Code Reviewer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sandbox/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Contributor Hub/i })).toBeInTheDocument();
  });

  it('displays the open issues count badge when openIssuesCount > 0', () => {
    render(
      <Sidebar
        activeTab="dashboard"
        onTabChange={vi.fn()}
        openIssuesCount={12}
      />
    );

    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('does not display an issue badge when openIssuesCount is 0', () => {
    render(
      <Sidebar
        activeTab="dashboard"
        onTabChange={vi.fn()}
        openIssuesCount={0}
      />
    );

    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('calls onTabChange with correct tab id when an item is clicked', async () => {
    const handleTabChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Sidebar
        activeTab="dashboard"
        onTabChange={handleTabChange}
        openIssuesCount={3}
      />
    );

    await user.click(screen.getByRole('button', { name: /Architecture/i }));
    expect(handleTabChange).toHaveBeenCalledWith('architecture');

    await user.click(screen.getByRole('button', { name: /Code Reviewer/i }));
    expect(handleTabChange).toHaveBeenCalledWith('code-reviewer');
  });

  it('renders AI Engine status indicator', () => {
    render(
      <Sidebar
        activeTab="dashboard"
        onTabChange={vi.fn()}
        openIssuesCount={0}
      />
    );

    expect(screen.getByText('AI Engine Online')).toBeInTheDocument();
  });
});
