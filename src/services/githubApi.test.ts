import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseGitHubUrl, fetchRealGitHubRepo, fetchGitHubUser } from './githubApi';

describe('githubApi service', () => {
  describe('parseGitHubUrl', () => {
    it('should parse standard https github URLs', () => {
      const res = parseGitHubUrl('https://github.com/facebook/react');
      expect(res).toEqual({ owner: 'facebook', repo: 'react' });
    });

    it('should parse http and www github URLs', () => {
      const res = parseGitHubUrl('http://www.github.com/vercel/next.js');
      expect(res).toEqual({ owner: 'vercel', repo: 'next.js' });
    });

    it('should strip trailing .git and trailing slashes', () => {
      const res = parseGitHubUrl('https://github.com/tailwindlabs/tailwindcss.git/');
      expect(res).toEqual({ owner: 'tailwindlabs', repo: 'tailwindcss' });
    });

    it('should parse shorthand "owner/repo" format', () => {
      const res = parseGitHubUrl('torvalds/linux');
      expect(res).toEqual({ owner: 'torvalds', repo: 'linux' });
    });

    it('should return null for invalid or empty formats', () => {
      expect(parseGitHubUrl('')).toBeNull();
      expect(parseGitHubUrl('justastring')).toBeNull();
      expect(parseGitHubUrl('https://gitlab.com/owner/repo')).toBeNull();
    });
  });

  describe('fetchRealGitHubRepo', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      globalThis.fetch = vi.fn();
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('should throw an error for invalid repository URLs', async () => {
      await expect(fetchRealGitHubRepo('invalid-url')).rejects.toThrow(
        /Invalid GitHub repository URL/i
      );
    });

    it('should throw an error when repo is not found (404)', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(fetchRealGitHubRepo('facebook/not-existing-repo')).rejects.toThrow(
        /was not found or is private/i
      );
    });

    it('should construct a repository object when GitHub returns valid data', async () => {
      const mockRepoData = {
        name: 'test-repo',
        full_name: 'test-owner/test-repo',
        owner: {
          login: 'test-owner',
          avatar_url: 'https://avatar.url',
        },
        description: 'A test repository',
        stargazers_count: 1200,
        forks_count: 300,
        open_issues_count: 10,
        language: 'TypeScript',
        default_branch: 'main',
      };

      (globalThis.fetch as any)
        // 1. Repo metadata
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockRepoData,
        })
        // 2. Root contents
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [
            { name: 'package.json', path: 'package.json', type: 'file' },
            { name: 'src', path: 'src', type: 'dir' },
          ],
        })
        // 3. Issues
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

      const repo = await fetchRealGitHubRepo('test-owner/test-repo');
      expect(repo.name).toBe('test-repo');
      expect(repo.owner).toBe('test-owner');
      expect(repo.stars).toBe(1200);
      expect(repo.language).toBe('TypeScript');
      expect(repo.architectureNodes.length).toBeGreaterThan(0);
      expect(repo.fileTree?.length).toBe(2);
    });
  });

  describe('fetchGitHubUser', () => {
    const originalFetch = globalThis.fetch;

    beforeEach(() => {
      globalThis.fetch = vi.fn();
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it('should fetch user profile and return a Contributor object', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          login: 'octocat',
          name: 'The Octocat',
          avatar_url: 'https://avatars.githubusercontent.com/u/583231',
          bio: 'GitHub mascot',
          public_repos: 8,
          followers: 10000,
          html_url: 'https://github.com/octocat',
        }),
      });

      const contributor = await fetchGitHubUser('octocat');
      expect(contributor.username).toBe('octocat');
      expect(contributor.name).toBe('The Octocat');
      expect(contributor.commitsThisMonth).toBeGreaterThanOrEqual(15);
      expect(contributor.prsMerged).toBeGreaterThanOrEqual(2);
      expect(contributor.badges).toContain('GitHub Verified');
    });

    it('should throw an error when user is not found', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(fetchGitHubUser('non-existent-user')).rejects.toThrow(
        /GitHub user "@non-existent-user" was not found/i
      );
    });
  });
});
