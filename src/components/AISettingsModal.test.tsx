import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AISettingsModal } from './AISettingsModal';
import type { AISettings } from '../types';

describe('AISettingsModal Component', () => {
  const defaultSettings: AISettings = {
    provider: 'google',
    model: 'gemini-2.0-flash',
    userApiKey: '',
    rateLimitPerMin: 10,
    protectionEnabled: true,
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <AISettingsModal
        isOpen={false}
        onClose={vi.fn()}
        settings={defaultSettings}
        onUpdateSettings={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal title and provider buttons when isOpen is true', () => {
    render(
      <AISettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onUpdateSettings={vi.fn()}
      />
    );

    expect(screen.getByText('AI Provider & API Key Settings')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Gemini' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OpenAI' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Claude' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Local/Ollama' })).toBeInTheDocument();
  });

  it('calls onUpdateSettings with new provider and default model when selecting a provider', async () => {
    const handleUpdateSettings = vi.fn();
    const user = userEvent.setup();

    render(
      <AISettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onUpdateSettings={handleUpdateSettings}
      />
    );

    await user.click(screen.getByRole('button', { name: 'OpenAI' }));
    expect(handleUpdateSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'openai',
        model: 'gpt-4o',
      })
    );
  });

  it('calls onUpdateSettings when API key input changes', async () => {
    const handleUpdateSettings = vi.fn();
    const user = userEvent.setup();

    render(
      <AISettingsModal
        isOpen={true}
        onClose={vi.fn()}
        settings={defaultSettings}
        onUpdateSettings={handleUpdateSettings}
      />
    );

    const input = screen.getByPlaceholderText(/Paste Google Gemini Key/i);
    await user.type(input, 'A');
    expect(handleUpdateSettings).toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <AISettingsModal
        isOpen={true}
        onClose={handleClose}
        settings={defaultSettings}
        onUpdateSettings={vi.fn()}
      />
    );

    // The modal's X button
    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons.find(b => b.querySelector('svg.lucide-x') !== null || b.className.includes('absolute'));
    expect(xButton).toBeDefined();
    if (xButton) {
      await user.click(xButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    }
  });
});
