# Orchiné Studio — Botanical Eco-Print Silk Scarves

Interactive commercial e-commerce atelier combining botanical eco-print craftsmanship with modern WebGL engineering (Next.js 15 App Router, React Three Fiber, Three.js, Framer Motion, Lenis, Zustand, and OpenAI-driven Orchéllia voice companion).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.17+ or v20+)
- npm (bundled with Node.js)

### Running the Development Server

You can start the development server using any of the following methods:

#### Method 1: VS Code Integrated Terminal (Recommended)

This project includes preconfigured [`.vscode/settings.json`](file:///.vscode/settings.json) that launches PowerShell with `-ExecutionPolicy Bypass`. Simply open a new terminal in VS Code (`Ctrl + ~`) and run:

```powershell
npm run dev
```

#### Method 2: Project Batch Runner (Windows)

Native Windows batch files bypass PowerShell execution policies completely:

```cmd
.\dev.cmd
```

#### Method 3: Direct npm.cmd (Windows PowerShell / CMD)

Invoke the Command Prompt wrapper directly in any shell:

```powershell
npm.cmd run dev
```

#### Method 4: Configure PowerShell ExecutionPolicy Once (Global for Current User)

If you prefer using standard `npm run dev` in standalone PowerShell windows, set your `CurrentUser` execution policy to `RemoteSigned` (no Administrator rights required):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

Or run the automated helper script in this repository:

```cmd
.\scripts\fix-execution-policy.bat
```

---

## Available Scripts

| Command | Batch Alternative | Description |
| :--- | :--- | :--- |
| `npm run dev` | `.\dev.cmd` | Starts Next.js development server on `http://localhost:3000` |
| `npm run build` | `.\build.cmd` | Builds the production bundle |
| `npm run start` | — | Starts the production server |
| `npm run lint` | — | Runs ESLint code quality checks |
| `npm run test` | — | Runs Vitest unit tests |

---

## Windows PowerShell Execution Policy (`PSSecurityException`) Note

When running `npm` on Windows, PowerShell resolves `C:\Program Files\nodejs\npm.ps1` before `npm.cmd`. If the Windows Execution Policy is set to `Restricted` (the default), PowerShell blocks script execution:

```text
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

This project provides built-in resolutions:
- [`.vscode/settings.json`](file:///.vscode/settings.json): Automatically bypasses script restriction inside VS Code.
- [`.vscode/tasks.json`](file:///.vscode/tasks.json): Pre-wired tasks for `dev`, `build`, `lint`, and `test` using `npm.cmd`.
- [`dev.cmd`](file:///dev.cmd) and [`build.cmd`](file:///build.cmd): Executable without PowerShell restrictions.
- [`scripts/fix-execution-policy.bat`](file:///scripts/fix-execution-policy.bat): One-click user policy update.
