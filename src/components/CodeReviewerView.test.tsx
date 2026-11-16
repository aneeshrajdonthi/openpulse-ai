import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeReviewerView } from './CodeReviewerView';
import { REPOSITORIES } from '../data/mockData';

describe('CodeReviewerView Component', () => {
  const mockRepo = REPOSITORIES[0];

  it('renders SAST scanner header and active code file', () => {
    render(<CodeReviewerView repo={mockRepo} />);

    expect(screen.getByText('AI Code Reviewer (SAST Audit)')).toBeInTheDocument();
    expect(screen.getByText(/Static security & quality scanner/i)).toBeInTheDocument();
  });

  it('renders security findings and allows applying an AI fix', async () => {
    const user = userEvent.setup();
    render(<CodeReviewerView repo={mockRepo} />);

    const applyFixButtons = screen.getAllByRole('button', { name: /Apply AI Fix/i });
    expect(applyFixButtons.length).toBeGreaterThan(0);

    await user.click(applyFixButtons[0]);
    expect(screen.getByText(/issue resolved!/i)).toBeInTheDocument();
  });
});
