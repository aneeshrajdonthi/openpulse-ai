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
  codeReviewFiles?: CodeReviewFile[];
  fileTree?: TreeNode[];
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  path: string;
  children?: TreeNode[];
  moduleType?: 'core' | 'component' | 'utility' | 'api' | 'config';
  fileSize?: string;
  description?: string;
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
  mappedFiles?: string[];
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

export interface CodeReviewFile {
  id: string;
  fileName: string;
  code: string;
  securityRating: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  qualityScore: number;
  findings: FindingItem[];
}

export interface FindingItem {
  id: string;
  line: number;
  severity: 'critical' | 'warning' | 'info';
  type: 'Security' | 'Type Safety' | 'Edge Case' | 'Performance';
  message: string;
  recommendation: string;
  fixedCode: string;
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

export type AIProvider = 'google' | 'openai' | 'anthropic' | 'ollama';

export interface AISettings {
  provider: AIProvider;
  model: string;
  userApiKey: string;
  customEndpoint?: string;
  rateLimitPerMin: number;
  protectionEnabled: boolean;
}
