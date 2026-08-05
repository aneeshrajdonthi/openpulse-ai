import { useState, useEffect } from 'react';
import type { SandboxFile } from '../types';
import { INITIAL_SANDBOX_FILES } from '../data/mockData';
import { Play, Copy, Check, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

export function LiveSandboxView() {
  const [files] = useState<SandboxFile[]>(INITIAL_SANDBOX_FILES);
  const [activeFileId, setActiveFileId] = useState<string>(files[0]?.id || '');
  const [output, setOutput] = useState<string>('Ready to run...');
  const [copied, setCopied] = useState(false);

  const activeFile = files.find(f => f.id === activeFileId);
  const [code, setCode] = useState<string>(activeFile?.content || '');

  useEffect(() => {
    if (activeFile) {
      setCode(activeFile.content);
    }
  }, [activeFileId, activeFile]);

  const handleRun = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setOutput(`> Running ${activeFile?.name}...\n\nOutput:\nHello World!\nExecution finished in 42ms.`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-4 text-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Live Sandbox</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Test and run code in isolated environment
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>Copy Code</span>
          </button>
          <button
            onClick={handleRun}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Run Script</span>
          </button>
        </div>
      </div>

      <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-900 min-h-0">
        <div className="flex items-center bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {files.map(file => (
            <button
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`px-4 py-2.5 text-sm font-medium border-r border-gray-200 dark:border-gray-800 whitespace-nowrap transition-colors ${
                activeFileId === file.id
                  ? 'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 border-t-2 border-t-indigo-600 dark:border-t-indigo-400'
                  : 'bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 border-t-2 border-t-transparent'
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>
        
        <div className="flex-1 flex min-h-0">
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-800">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
              spellCheck={false}
            />
          </div>
          <div className="w-1/2 bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-auto">
            <div className="flex items-center space-x-2 mb-4 text-gray-400">
              <Terminal className="w-4 h-4" />
              <span>Console Output</span>
            </div>
            <pre className="whitespace-pre-wrap text-gray-300">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
