# Arm Architecture Reference Wiki & Personal Learning Tracker

A self-contained, high-performance static mirror of the comprehensive AArch64 instruction set and system register documentation, featuring an integrated personal learning tracker and offline/online client-side WebAssembly search.

---

## Features

- **Complete AArch64 Reference**: 4,285+ documentation pages covering:
  - Base Integer instructions
  - SIMD & Floating-Point (Neon)
  - SVE & SVE2 (Scalable Vector Extension)
  - SME (Scalable Matrix Extension)
  - System Registers (AArch64 & AArch32)
- **Zero-Dependency Fast Search**: Full-text client-side WebAssembly search powered by Pagefind (works both online and 100% offline).
- **Personal Learning Roadmap & To-Do List**:
  - Replaces the shutdown notice with an interactive study roadmap.
  - Interactive milestones covering core architecture topics.
  - Personal to-do list with persistent browser storage (`localStorage`).
  - Single-click `[ ] MARK AS LEARNED` button on every instruction page.
- **Identical Typography & Graphics**: All fonts (Berkeley Mono), diagram styles, bitfield encoding tables, and pseudocode renderings preserved 1:1.
- **Ready for Vercel, GitHub Pages, or Cloudflare Pages**.

---

## Deploy to Vercel (Recommended)

### Option 1: Via GitHub (Simplest)
1. Create a new GitHub repository (e.g. `arm-wiki`).
2. Push this directory to your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/arm-wiki.git
   git branch -M main
   git push -u origin main
   ```
3. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
4. Import your `arm-wiki` repository.
5. Vercel automatically detects the static configuration (`vercel.json`). Click **Deploy**.
6. Your live personal wiki is instantly available at `https://arm-wiki.vercel.app`!

### Option 2: Via Vercel CLI (1-Command Deploy)
If you have Node.js / Vercel CLI installed:
```bash
npx vercel
```
Follow the interactive prompts to deploy directly from your terminal.

---

## Local Preview

You can run and browse this wiki locally at any time without installing any dependencies:

```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your web browser.
