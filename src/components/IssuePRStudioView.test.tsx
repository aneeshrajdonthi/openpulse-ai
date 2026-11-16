import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IssuePRStudioView } from './IssuePRStudioView';
import { REPOSITORIES } from '../data/mockData';

describe('IssuePRStudioView Component', () => {
  const mockRepo = REPOSITORIES[0];

  beforeEach(() => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
  });

  it('renders active issue details and difficulty tag', () => {
    render(<IssuePRStudioView repo={mockRepo} />);

    const firstIssue = mockRepo.issues[0];
    expect(screen.getByText(firstIssue.title)).toBeInTheDocument();
    expect(screen.getByText(`#${firstIssue.number}`)).toBeInTheDocument();
    expect(screen.getByText(firstIssue.difficulty)).toBeInTheDocument();
  });

  it('allows checking off steps in the AI resolution checklist', async () => {
    const user = userEvent.setup();
    render(<IssuePRStudioView repo={mockRepo} />);

    const firstStep = mockRepo.issues[0].proposedFixPlan[0];
    const stepElement = screen.getByText(firstStep);
    expect(stepElement).toBeInTheDocument();

    await user.click(stepElement);
    expect(stepElement).toHaveClass('line-through');
  });

  it('allows copying AI generated code diff and PR description', async () => {
    const user = userEvent.setup();
    render(<IssuePRStudioView repo={mockRepo} />);

    const copyCodeBtn = screen.getByRole('button', { name: /Copy Code/i });
    await user.click(copyCodeBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    const copyPRBtn = screen.getByRole('button', { name: /Copy PR Description/i });
    await user.click(copyPRBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
