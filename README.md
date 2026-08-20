<div align="center">

# ⚡ OpenPulse AI (v2.0)

### Real-Time System Architecture Visualizer & Multi-Model AI Development Workspace

[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4.svg?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>OpenPulse AI</b> parses public GitHub repositories into interactive System Architecture topology flowcharts, AST file trees, SAST security audits, and multi-model AI issue resolution plans.
</p>

[Explore Live Web App](https://github.com/aneeshrajdonthi/openpulse-ai) • [Report Issue](https://github.com/aneeshrajdonthi/openpulse-ai/issues) • [BYOK Docs](#-multi-model-provider-byok)

---

</div>

## 🌟 Key Features

### 🕸️ System Architecture & Data Flow Visualizer
* **System Design Data Flow Diagram**: Maps out application architecture layers (`UI Presentation` ➔ `State Routing` ➔ `REST API Client` ➔ `AI Security Engine` ➔ `Build Pipeline`) with directional data flow lines.
* **In-Line Expandable File Cards**: Click any architecture layer to inspect its mapped source files with file basenames, full file paths, and plain-English role descriptions.
* **Directory Tree View**: Interactive, collapsible file tree representation of root folders and subdirectories.

### 🤖 Multi-Model Provider & BYOK (Bring Your Own Key)
* **Google Gemini**: Native support for `gemini-2.0-flash` and `gemini-1.5-pro`.
* **OpenAI**: Support for `gpt-4o`, `gpt-4o-mini`, and `o3-mini`.
* **Anthropic Claude**: Support for `claude-3-5-sonnet` and `claude-3-haiku`.
* **Local Offline LLMs (Ollama)**: Connect local offline models (`llama3.2`, `deepseek-r1`) running at `http://localhost:11434/v1` for 0 API cost.

### 🛡️ SAST Security Auditor
* Multi-file security and code quality audit scanner highlighting critical injection risks, type safety gaps, performance bottlenecks, and edge case vulnerabilities.
* **Instant AI Fix**: One-click AI refactoring patches that fix security findings directly in the editor.

### ⚡ AI Issue & PR Studio
* Analyzes open GitHub repository issues and generates step-by-step resolution checklists.
* Generates live git code diffs showing exact line-by-line modifications (`-` and `+`).
* Produces production-ready Pull Request descriptions with release notes and verification instructions.

### 👥 Contributor Hub & Badges
* Real-time GitHub username lookup displaying avatar, merged PRs, commit metrics, and contribution ranks (`Maintainer`, `Core Contributor`, `Rising Star`).
* Automated Shields.io badge generator and release notes markdown builder.

### 💻 Live Sandbox Playground
* Multi-file in-browser code editor with syntax highlighting, language selector, and dark terminal execution console.

---

## 🎨 Theme Support

* **Vercel Obsidian Dark Mode**: High-contrast pitch-black theme (`#000000`) with neutral zinc slate cards (`#121215`) and subtle borders.
* **Stripe/Vercel Warm Light Mode**: Warm neutral white canvas (`#fafafa`) with crisp white card surfaces (`#ffffff`) and deep charcoal typography (`#09090b`).
* Persistent theme preference saved automatically in `localStorage`.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Hooks, Functional Components, Strict Mode) |
| **Language** | TypeScript (Strict Typing, Interface Contracts) |
| **Styling & Theme** | Tailwind CSS v4 (`@tailwindcss/vite`), Plus Jakarta Sans, JetBrains Mono |
| **Icons** | Lucide React |
| **Build Tool** | Vite 6 |
| **External APIs** | GitHub REST API (`/repos`, `/contents`, `/issues`, `/contributors`) |
| **LLM Provider Integration** | Google Gemini, OpenAI REST, Anthropic REST, Ollama Local API |

---

## 📥 Getting Started

### Prerequisites
* **Node.js** v18+ 
* **npm** v9+

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/aneeshrajdonthi/openpulse-ai.git

# 2. Navigate into the project directory
cd openpulse-ai

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open your browser at `http://localhost:5173/` to run OpenPulse AI locally!

---

## 📂 Project Structure

```
openpulse-ai/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                # Top header with repo selector, search, theme toggle
│   │   ├── Sidebar.tsx               # Slim navigation sidebar with active tab indicators
│   │   ├── DashboardView.tsx         # Health score, stats grid, recent open issues
│   │   ├── ArchitectureGraphView.tsx # System Design flowchart & expandable file tree
│   │   ├── IssuePRStudioView.tsx     # AI issue solver, resolution checklist, git diff
│   │   ├── CodeReviewerView.tsx      # SAST security auditor & inline refactoring patches
│   │   ├── ContributorHubView.tsx    # Contributor profiles, badges, release notes
│   │   ├── LiveSandboxView.tsx       # Code playground & terminal output console
│   │   ├── AISettingsModal.tsx       # Multi-model LLM provider selection (BYOK)
│   │   ├── BeginnerGuideModal.tsx    # Beginner handbook & repo URL guide
│   │   └── NewRepoModal.tsx          # GitHub repo URL connector
│   ├── services/
│   │   └── githubApi.ts              # Live GitHub REST API service & AST builder
│   ├── data/
│   │   └── mockData.ts               # Pre-loaded repository dataset & fallback stores
│   ├── types/
│   │   └── index.ts                  # Global TypeScript interfaces & data contracts
│   ├── App.tsx                       # Root React app shell & global theme manager
│   ├── main.tsx                      # DOM entry point
│   └── index.css                     # Tailwind CSS v4 theme design system
├── public/                           # Static assets & icons
├── vite.config.ts                    # Vite & Tailwind v4 bundler configuration
├── package.json                      # Project dependencies & build scripts
└── README.md                         # Project documentation
```

---

## 👤 Author

**Aneesh Raj Donthi**
* **Role**: AI Engineer @ Tata Electronics | NIT Warangal '25
* **GitHub**: [@aneeshrajdonthi](https://github.com/aneeshrajdonthi)
* **LinkedIn**: [Aneesh Raj Donthi](https://www.linkedin.com/in/aneeshrajdonthi)
* **Portfolio**: [freelanceportfolio-teal.vercel.app](https://freelanceportfolio-teal.vercel.app/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
