import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Root Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders application navbar, sidebar, and initial dashboard view', () => {
    render(<App />);

    expect(screen.getByText('OpenPulse AI')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Development')).toBeInTheDocument();
    expect(screen.getByText('AI Engine Online')).toBeInTheDocument();

    // Default active tab is dashboard
    expect(screen.getByRole('heading', { level: 1, name: 'react' })).toBeInTheDocument();
  });

  it('switches between tabs when navigation links are clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click Sandbox tab in sidebar
    await user.click(screen.getByRole('button', { name: /^Sandbox$/i }));
    expect(screen.getByText(/Live Sandbox/i)).toBeInTheDocument();

    // Click Contributor Hub tab
    await user.click(screen.getByRole('button', { name: /^Contributor Hub$/i }));
    expect(screen.getByRole('heading', { level: 1, name: /Contributor Hub/i })).toBeInTheDocument();
  });

  it('toggles theme and persists preference in localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initially dark mode
    const themeBtn = screen.getByTitle('Switch to Light Mode');
    expect(themeBtn).toBeInTheDocument();

    await user.click(themeBtn);

    // Should switch to light mode and save to localStorage
    expect(localStorage.getItem('openpulse_theme')).toBe('light');
    expect(screen.getByTitle('Switch to Dark Mode')).toBeInTheDocument();

    // Toggle back
    await user.click(screen.getByTitle('Switch to Dark Mode'));
    expect(localStorage.getItem('openpulse_theme')).toBe('dark');
  });

  it('opens and closes AI Settings modal', async () => {
    const user = userEvent.setup();
    render(<App />);

    const aiSettingsBtn = screen.getByTitle('AI Settings');
    await user.click(aiSettingsBtn);

    expect(screen.getByText('AI Provider & API Key Settings')).toBeInTheDocument();
  });
});
