# AGENTS.md — instructions for coding agents (Jules)

## What this repo is
A Remotion (React) project where videos are written as code. The owner is not a programmer and cannot run anything locally. You write the code; the owner renders the MP4 with GitHub Actions (`.github/workflows/render.yml`). You never deliver an MP4.

## Read these first, in this order
1. `skills/remotion-best-practices/SKILL.md` — router for the official Remotion skills. Its links (`./remotion-create/REFERENCE.md`, `./remotion-markup/REFERENCE.md`, ...) resolve inside that folder. Links to skills that are not in this repo (maps, saas, multimedia, captions, studio, upgrade) can be ignored.
2. `skills/remotion-best-practices/remotion-markup/REFERENCE.md` — animation, layout, text, effects, timing. Then open the specific files you need, for example `timing.md`, `sequencing.md`, `transitions.md`, `text-highlights.md`, `multi-scene-video.md`, `effects.md`, `google-fonts.md`, `compositions.md`, `measuring-text.md`.
3. `skills/remotion-best-practices/remotion-create/video-layout.md` — video-first layout and text sizing.
4. The brief the owner names in the task (files in `briefs/`). Follow it exactly.

## Rules for THIS repo (they override the skills where they differ)
- **No browser, no preview.** Do not start Remotion Studio. Do not render the final MP4. The skills' advice to "open the preview" does not apply here.
- **The project already exists.** Skip scaffolding. Do not create a sub-project. The entry file is `src/index.ts`, the root is `src/Root.tsx`.
- **Keep the composition id exactly `Short30`** (1080x1920, 30 fps, 900 frames) unless the brief says otherwise. The GitHub Action renders that id.
- **Checks you must run and report:**
  - `npm install`
  - `npx tsc --noEmit` (must pass)
  - `npx remotion compositions src/index.ts` (must list the composition with the right size, fps and duration)
  - If your VM can download a browser, also try `npx remotion still src/index.ts Short30 out/check.png --frame=<N>` for a few key frames and look at them. Never commit `out/`. If it cannot run, say so plainly. Do not claim you verified visuals you could not see.
- **Dependencies:** add packages with `npx remotion add <package>`. All `remotion` and `@remotion/*` packages must be the same exact version. After the first `npm install`, replace `"latest"` in `package.json` with the exact installed versions, and commit `package-lock.json`.
- **Deterministic animation only:** drive everything from `useCurrentFrame()`. No CSS `transition` or `animation`, no Tailwind animation classes, no `Math.random`, `Date.now`, `setTimeout` or `useEffect` for animation. For randomness use `random("some-seed")` from `remotion`.
- **Keep renders cheap** (GitHub runners have no GPU): avoid CSS `filter: blur()`, `drop-shadow`, `backdrop-filter` and large `box-shadow`. Fake glows with layered semi-transparent shapes. Avoid WebGL, giant canvases and per-frame SVG filters unless the brief requires them.
- **Draw everything in code** (SVG and CSS). No stock footage, no downloaded images, no audio unless the brief says so. Fonts only through `@remotion/google-fonts`.
- **Do not "fix" the Hinglish text.** Copy the strings from the brief exactly (Roman script, same spelling). Do not translate and do not switch to Devanagari.

## Git
- Work on a new branch. Never commit to `main`.
- Small clear commits. Do not commit `node_modules/` or `out/`.

## When you finish, tell the owner (max 8 lines)
1. What you built, scene by scene.
2. The exact output of `npx remotion compositions src/index.ts`.
3. What you could not verify (for example visuals, render time).
4. Any place you deviated from the brief, and why.
