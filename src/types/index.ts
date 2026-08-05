export type ActiveTab = 
  | 'dashboard'
  | 'architecture'
  | 'issue-studio'
  | 'code-reviewer'
  | 'contributor-hub'
  | 'sandbox';

export interface Repository {
  id: string;
  name: string;
  owner: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  description: string;
  healthScore: number;
  goodFirstIssuesCount: number;
  architectureNodes: ArchNode[];
  issues: IssueItem[];
  codeReviewPreset?: CodeReviewPreset;
}

export interface ArchNode {
  id: string;
  label: string;
  type: 'core' | 'component' | 'utility' | 'api' | 'config';
  fileCount: number;
  connections: string[];
  complexity: 'Low' | 'Medium' | 'High';
  goodFirstIssueCount: number;
  description: string;
}

export interface IssueItem {
  id: string;
  number: number;
  title: string;
  labels: string[];
  difficulty: 'Good First Issue' | 'Intermediate' | 'Advanced';
  status: 'Open' | 'In Progress' | 'Resolved';
  author: string;
  createdAgo: string;
  body: string;
  affectedFiles: string[];
  proposedFixPlan: string[];
  gitDiff: {
    filePath: string;
    oldCode: string;
    newCode: string;
  }[];
  generatedTests: string[];
}

export interface CodeReviewPreset {
  id: string;
  title: string;
  fileName: string;
  originalCode: string;
  score: number;
  securityRating: 'A+' | 'B' | 'C' | 'D' | 'F';
  findings: {
    id: string;
    line: number;
    severity: 'critical' | 'warning' | 'info';
    type: 'Security' | 'Performance' | 'Memory Leak' | 'Style';
    message: string;
    recommendation: string;
    fixedSnippet?: string;
  }[];
}

export interface Contributor {
  id: string;
  name: string;
  username: string;
  avatar: string;
  prsMerged: number;
  commitsThisMonth: number;
  linesAdded: number;
  linesDeleted: number;
  rank: 'Maintainer' | 'Core Contributor' | 'Rising Star' | 'First Timer';
  badges: string[];
}

export interface SandboxFile {
  id: string;
  name: string;
  language: 'typescript' | 'javascript' | 'json' | 'markdown';
  content: string;
}

export interface AISettings {
  model: 'gemini-1.5-flash' | 'gemini-2.0-flash' | 'custom-key';
  userApiKey: string;
  rateLimitPerMin: number;
  protectionEnabled: boolean;
}
