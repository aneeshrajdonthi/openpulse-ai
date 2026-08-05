import type { Repository, Contributor, SandboxFile } from '../types';

export const REPOSITORIES: Repository[] = [
  {
    id: 'repo-1',
    name: 'react',
    owner: 'facebook',
    stars: 224500,
    forks: 45800,
    openIssues: 382,
    language: 'TypeScript / C++',
    description: 'A JavaScript library for building user interfaces with concurrent rendering and fiber architecture.',
    healthScore: 94,
    goodFirstIssuesCount: 24,
    architectureNodes: [
      {
        id: 'node-fiber',
        label: 'ReactFiberReconciler',
        type: 'core',
        fileCount: 42,
        connections: ['node-hooks', 'node-scheduler', 'node-dom'],
        complexity: 'High',
        goodFirstIssueCount: 2,
        description: 'Core incremental reconciler algorithm managing work-in-progress trees and priority queues.'
      },
      {
        id: 'node-hooks',
        label: 'ReactHooksDispatcher',
        type: 'component',
        fileCount: 18,
        connections: ['node-fiber'],
        complexity: 'Medium',
        goodFirstIssueCount: 5,
        description: 'Manages hook execution order, state memoization (useState, useMemo), and effect queues.'
      },
      {
        id: 'node-scheduler',
        label: 'SchedulerPriorityQueue',
        type: 'utility',
        fileCount: 12,
        connections: ['node-fiber'],
        complexity: 'High',
        goodFirstIssueCount: 1,
        description: 'Cooperative multi-tasking scheduler yielding time slices to prevent main-thread blocking.'
      },
      {
        id: 'node-dom',
        label: 'ReactDOMHostConfig',
        type: 'api',
        fileCount: 35,
        connections: ['node-fiber'],
        complexity: 'Medium',
        goodFirstIssueCount: 8,
        description: 'DOM platform abstractions, synthetic event pooling, and hydration reconciler.'
      },
      {
        id: 'node-compiler',
        label: 'ReactCompilerPlugins',
        type: 'config',
        fileCount: 24,
        connections: ['node-fiber', 'node-hooks'],
        complexity: 'Low',
        goodFirstIssueCount: 8,
        description: 'Auto-memoization AST transformer optimizing dependency arrays automatically.'
      }
    ],
    issues: [
      {
        id: 'issue-101',
        number: 28412,
        title: 'Fix edge case in useDeferredValue race condition during rapid state mutations',
        labels: ['good-first-issue', 'hooks', 'high-priority'],
        difficulty: 'Good First Issue',
        status: 'Open',
        author: 'dan_abramov_fan',
        createdAgo: '3 hours ago',
        body: 'When triggering `useDeferredValue` inside a rapid input event loop with async transition boundaries, stale values can overwrite newly rendered deferred updates if the prior transition yields early.',
        affectedFiles: ['packages/react-reconciler/src/ReactFiberHooks.js'],
        proposedFixPlan: [
          'Locate updateDeferredValue dispatcher in ReactFiberHooks.js',
          'Add transaction epoch counter to compare render lane timestamps',
          'Bypass stale deferred update propagation if epoch timestamp is lower than current committed lane',
          'Add unit test verifying rapid deferred state transitions'
        ],
        gitDiff: [
          {
            filePath: 'packages/react-reconciler/src/ReactFiberHooks.js',
            oldCode: `function updateDeferredValue<T>(value: T): T {
  const hook = updateWorkInProgressHook();
  const prevValue = hook.memoizedState;
  if (isSubsetOfLanes(renderLanes, DeferredLane)) {
    hook.memoizedState = value;
    return value;
  }
  return prevValue;
}`,
            newCode: `function updateDeferredValue<T>(value: T): T {
  const hook = updateWorkInProgressHook();
  const prevValue = hook.memoizedState;
  const currentRenderTime = requestCurrentTimeLanes();
  
  // Verify transaction epoch before committing deferred snapshot
  if (isSubsetOfLanes(renderLanes, DeferredLane) && currentRenderTime >= hook.lastRenderTime) {
    hook.memoizedState = value;
    hook.lastRenderTime = currentRenderTime;
    return value;
  }
  return prevValue;
}`
          }
        ],
        generatedTests: [
          'it("should drop stale deferred value updates during high frequency lane switching", async () => {\n  const [val, setVal] = useState(0);\n  const deferred = useDeferredValue(val);\n  // Simulate rapid 100ms dispatch loop\n});'
        ]
      },
      {
        id: 'issue-102',
        number: 28430,
        title: 'Optimize SyntheticEvent pooling cleanup to prevent memory leaks in long-lived SPAs',
        labels: ['performance', 'dom', 'intermediate'],
        difficulty: 'Intermediate',
        status: 'Open',
        author: 'perf_wizard',
        createdAgo: '1 day ago',
        body: 'Event object references held in listener maps can delay garbage collection of unmounted component trees under high synthetic event traffic.',
        affectedFiles: ['packages/react-dom/src/events/DOMPluginEventSystem.js'],
        proposedFixPlan: [
          'Implement WeakRef cache for synthetic event wrappers',
          'Clear event queue references on passive listener execution completion',
          'Add memory footprint test suite'
        ],
        gitDiff: [
          {
            filePath: 'packages/react-dom/src/events/DOMPluginEventSystem.js',
            oldCode: `function dispatchEventsForPlugins(topLevelType, targetInst, nativeEvent) {
  const events = extractEvents(topLevelType, targetInst, nativeEvent);
  runEventQueueInBatch(events);
}`,
            newCode: `function dispatchEventsForPlugins(topLevelType, targetInst, nativeEvent) {
  const events = extractEvents(topLevelType, targetInst, nativeEvent);
  try {
    runEventQueueInBatch(events);
  } finally {
    // Release synthetic references for GC immediately after batch release
    if (events) {
      for (let i = 0; i < events.length; i++) {
        events[i].nativeEventTarget = null;
        events[i].targetInst = null;
      }
    }
  }
}`
          }
        ],
        generatedTests: [
          'test("synthetic event target instance references are nullified post dispatch", () => {\n  // Verify event memory cleanup\n});'
        ]
      }
    ],
    codeReviewFiles: [
      {
        id: 'rev-react-1',
        fileName: 'ReactFiberWorkLoop.ts',
        code: `export function performUnitOfWork(unitOfWork: Fiber): void {
  const current = unitOfWork.alternate;
  let next = beginWork(current, unitOfWork, renderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
  
  // Direct state mutation without lane validation
  (unitOfWork as any).flags |= UpdateFlag;
  console.log("Processing fiber unit: " + unitOfWork.tag);
}`,
        qualityScore: 68,
        securityRating: 'C',
        findings: [
          {
            id: 'find-1',
            line: 11,
            severity: 'critical',
            type: 'Security',
            message: 'Unsafe type casting (as any) bypasses compiler type safety and may corrupt fiber flags.',
            recommendation: 'Use strictly typed bitwise helper functions like `addFiberFlag(unitOfWork, UpdateFlag)`.',
            fixedCode: `export function performUnitOfWork(unitOfWork: Fiber): void {
  const current = unitOfWork.alternate;
  let next = beginWork(current, unitOfWork, renderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
  
  addFiberFlag(unitOfWork, UpdateFlag);
}`
          },
          {
            id: 'find-2',
            line: 12,
            severity: 'warning',
            type: 'Performance',
            message: 'Leftover console.log string concatenation in hot reconciliation work loop.',
            recommendation: 'Remove debugging console statements or wrap inside __DEV__ flag checks.',
            fixedCode: `export function performUnitOfWork(unitOfWork: Fiber): void {
  const current = unitOfWork.alternate;
  let next = beginWork(current, unitOfWork, renderLanes);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  
  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
  
  if (__DEV__) { logFiberUnit(unitOfWork); }
}`
          }
        ]
      }
    ]
  },
  {
    id: 'repo-2',
    name: 'next.js',
    owner: 'vercel',
    stars: 121000,
    forks: 26400,
    openIssues: 410,
    language: 'TypeScript / Rust',
    description: 'The React Framework for the Web featuring Turbopack, App Router, Server Components, and Edge Runtime.',
    healthScore: 91,
    goodFirstIssuesCount: 18,
    architectureNodes: [
      {
        id: 'node-next-router',
        label: 'AppRouterEngine',
        type: 'core',
        fileCount: 65,
        connections: ['node-next-rsc', 'node-next-turbo'],
        complexity: 'High',
        goodFirstIssueCount: 4,
        description: 'App router layout trees, parallel routes, intercepting routes, and flight data response stream.'
      },
      {
        id: 'node-next-rsc',
        label: 'ServerComponentsPipeline',
        type: 'component',
        fileCount: 48,
        connections: ['node-next-router'],
        complexity: 'High',
        goodFirstIssueCount: 3,
        description: 'Server Action payload serialization, RSC stream decoder, and client boundary resolution.'
      },
      {
        id: 'node-next-turbo',
        label: 'TurbopackBundler',
        type: 'utility',
        fileCount: 112,
        connections: ['node-next-router'],
        complexity: 'High',
        goodFirstIssueCount: 5,
        description: 'Rust-powered incremental bundler providing instant HMR and dynamic code splitting.'
      },
      {
        id: 'node-next-middleware',
        label: 'EdgeMiddlewareRuntime',
        type: 'api',
        fileCount: 22,
        connections: ['node-next-router'],
        complexity: 'Medium',
        goodFirstIssueCount: 6,
        description: 'V8 isolate edge runtime execution layer for request mutation and rewrite headers.'
      }
    ],
    issues: [
      {
        id: 'issue-201',
        number: 64210,
        title: 'Fix Server Action response header encoding for non-ASCII characters',
        labels: ['good-first-issue', 'rsc', 'app-router'],
        difficulty: 'Good First Issue',
        status: 'Open',
        author: 'next_dev_guru',
        createdAgo: '5 hours ago',
        body: 'When returning custom UTF-8 headers in Server Action responses, international characters are corrupted due to missing Latin-1 to UTF-8 encoder transformation.',
        affectedFiles: ['packages/next/src/server/app-render/action-handler.ts'],
        proposedFixPlan: [
          'Import encodeURIComponent / TextEncoder helper in action-handler',
          'Encode x-action-result header values with RFC 5987 standard',
          'Add UTF-8 header test fixture'
        ],
        gitDiff: [
          {
            filePath: 'packages/next/src/server/app-render/action-handler.ts',
            oldCode: `res.setHeader('x-action-result', String(result));`,
            newCode: `const encodedResult = encodeURIComponent(String(result));
res.setHeader('x-action-result', encodedResult);`
          }
        ],
        generatedTests: [
          'test("action result handles unicode headers gracefully", async () => {\n  const res = await callAction({ data: "café" });\n  expect(res.headers.get("x-action-result")).toBe("caf%C3%A9");\n});'
        ]
      }
    ],
    codeReviewFiles: [
      {
        id: 'rev-next-1',
        fileName: 'app-revalidate.ts',
        code: `export async function revalidatePath(path: string, type?: 'layout' | 'page') {
  // Direct path injection without sanitization
  const cacheKey = "route_cache_" + path;
  await globalCacheStore.delete(cacheKey);
  console.log("Cache evicted for key: " + cacheKey);
}`,
        qualityScore: 74,
        securityRating: 'B',
        findings: [
          {
            id: 'find-next-1',
            line: 3,
            severity: 'warning',
            type: 'Security',
            message: 'Unsanitized user path string used directly in route cache key generation.',
            recommendation: 'Sanitize path parameter to prevent cache poisoning attacks.',
            fixedCode: `export async function revalidatePath(path: string, type?: 'layout' | 'page') {
  const sanitizedPath = sanitizeRoutePath(path);
  const cacheKey = "route_cache_" + sanitizedPath;
  await globalCacheStore.delete(cacheKey);
}`
          }
        ]
      }
    ]
  },
  {
    id: 'repo-3',
    name: 'langchain',
    owner: 'langchain-ai',
    stars: 92000,
    forks: 14800,
    openIssues: 290,
    language: 'Python / TypeScript',
    description: 'Building applications with LLMs through composable chains, memory, vector indexes, and agentic workflows.',
    healthScore: 96,
    goodFirstIssuesCount: 32,
    architectureNodes: [
      {
        id: 'node-lc-agents',
        label: 'AgentExecutorEngine',
        type: 'core',
        fileCount: 40,
        connections: ['node-lc-vector', 'node-lc-tools'],
        complexity: 'High',
        goodFirstIssueCount: 8,
        description: 'ReAct agent loop, tool routing, conversation memory management, and structured output parsing.'
      },
      {
        id: 'node-lc-vector',
        label: 'VectorStoreIndexers',
        type: 'utility',
        fileCount: 75,
        connections: ['node-lc-agents'],
        complexity: 'Medium',
        goodFirstIssueCount: 12,
        description: 'Embeddings pipeline, FAISS / Pinecone / Chroma integrations, and hybrid retriever scoring.'
      },
      {
        id: 'node-lc-tools',
        label: 'ToolRegistryAndSandbox',
        type: 'api',
        fileCount: 60,
        connections: ['node-lc-agents'],
        complexity: 'Low',
        goodFirstIssueCount: 12,
        description: 'Tool definition schema, OpenAPI spec converters, and sandboxed code execution tools.'
      }
    ],
    issues: [
      {
        id: 'issue-301',
        number: 14502,
        title: 'Add timeout parameter and retry backoff to OpenAIChatModel stream handler',
        labels: ['good-first-issue', 'models', 'reliability'],
        difficulty: 'Good First Issue',
        status: 'Open',
        author: 'ai_builder_99',
        createdAgo: '2 hours ago',
        body: 'When streaming long LLM tokens, network drops can cause infinite pending promises. Adding a configurable `requestTimeout` prevents hanging promises.',
        affectedFiles: ['libs/langchain-openai/src/chat_models.ts'],
        proposedFixPlan: [
          'Add timeout option to ChatOpenAI constructor parameters',
          'Wrap streaming iterator inside AbortSignal.timeout()',
          'Add streaming timeout unit test'
        ],
        gitDiff: [
          {
            filePath: 'libs/langchain-openai/src/chat_models.ts',
            oldCode: `const stream = await this.client.chat.completions.create(params);`,
            newCode: `const signal = this.requestTimeout ? AbortSignal.timeout(this.requestTimeout) : undefined;
const stream = await this.client.chat.completions.create({ ...params, signal });`
          }
        ],
        generatedTests: [
          'test("streaming drops after configured timeout limit", async () => {\n  const model = new ChatOpenAI({ requestTimeout: 1000 });\n  // Assert abort exception\n});'
        ]
      }
    ],
    codeReviewFiles: [
      {
        id: 'rev-lc-1',
        fileName: 'agent_executor.py',
        code: `def execute_tool_call(tool_name: str, tool_input: str):
    # Unsafe eval execution of dynamically constructed tool input
    result = eval(f"{tool_name}({tool_input})")
    return str(result)`,
        qualityScore: 42,
        securityRating: 'F',
        findings: [
          {
            id: 'find-lc-1',
            line: 3,
            severity: 'critical',
            type: 'Security',
            message: 'CRITICAL VULNERABILITY: Use of eval() on raw user prompt inputs enables Remote Code Execution (RCE).',
            recommendation: 'Replace eval() with safe tool dispatcher dictionary lookup.',
            fixedCode: `def execute_tool_call(tool_name: str, tool_input: str):
    if tool_name not in APPROVED_TOOLS:
        raise ValueError("Unauthorized tool call")
    return str(APPROVED_TOOLS[tool_name](tool_input))`
          }
        ]
      }
    ]
  }
];

export const CONTRIBUTORS_LIST: Contributor[] = [
  {
    id: 'c-1',
    name: 'Aneesh Raj',
    username: 'aneeshrajdonthi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    prsMerged: 42,
    commitsThisMonth: 86,
    linesAdded: 14200,
    linesDeleted: 3410,
    rank: 'Maintainer',
    badges: ['Top 1% Contributor', 'AI Agent Pioneer', 'Bug Hunter Supreme', 'Architecture Architect']
  },
  {
    id: 'c-2',
    name: 'Sarah Chen',
    username: 'schen_dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    prsMerged: 28,
    commitsThisMonth: 45,
    linesAdded: 8900,
    linesDeleted: 1200,
    rank: 'Core Contributor',
    badges: ['Performance Ninja', 'React Specialist']
  },
  {
    id: 'c-3',
    name: 'Alex Rivera',
    username: 'arivera_oss',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    prsMerged: 15,
    commitsThisMonth: 29,
    linesAdded: 4500,
    linesDeleted: 890,
    rank: 'Rising Star',
    badges: ['First PR Merged', 'Documentation Hero']
  }
];

export const INITIAL_SANDBOX_FILES: SandboxFile[] = [
  {
    id: 'sb-1',
    name: 'agent_solver.ts',
    language: 'typescript',
    content: `// OpenPulse AI Agent Resolution Simulator
interface IssueContext {
  id: string;
  repo: string;
  title: string;
  files: string[];
}

export async function analyzeIssueAndSuggestFix(context: IssueContext) {
  console.log(\`[OpenPulse AI] Analyzing \${context.repo} issue #\${context.id}...\`);
  
  // Step 1: Parse code AST
  const astTree = { modules: context.files.length, complexityScore: 4.8 };
  console.log(\`[OpenPulse AI] Mapped AST with \${astTree.modules} module entry points.\`);

  // Step 2: Generate proposed patch
  const patch = {
    status: "READY",
    confidence: "98.4%",
    suggestedBranch: \`fix/issue-\${context.id}\`,
    summary: \`Resolved race condition in \${context.files[0]} by adding epoch timestamp checks.\`
  };

  return patch;
}

// Execute test run
analyzeIssueAndSuggestFix({
  id: "28412",
  repo: "facebook/react",
  title: "useDeferredValue race condition",
  files: ["packages/react-reconciler/src/ReactFiberHooks.js"]
}).then(res => console.log("[Result]", JSON.stringify(res, null, 2)));`
  },
  {
    id: 'sb-2',
    name: 'security_auditor.py',
    language: 'javascript',
    content: `// Automated SAST Security Scanner Script
function auditCodeSnippet(code) {
  const rules = [
    { pattern: /eval\\(/g, name: "Remote Code Execution (RCE) via eval()" },
    { pattern: /innerHTML\\s*=/g, name: "Cross-Site Scripting (XSS) via innerHTML" },
    { pattern: /as\\s+any/g, name: "Unsafe Type Casting" }
  ];

  const findings = [];
  rules.forEach(rule => {
    if (rule.pattern.test(code)) {
      findings.push({ rule: rule.name, status: "VULNERABILITY DETECTED" });
    }
  });

  return findings;
}

const sampleCode = "element.innerHTML = userInput; eval(userScript);";
console.log("[Audit Findings]:", auditCodeSnippet(sampleCode));`
  }
];
