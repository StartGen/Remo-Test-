# Remotion Shorts

Videos written as code with [Remotion](https://www.remotion.dev), written by a coding agent (Jules) and rendered by GitHub Actions. Nothing runs on a local computer.

## How it works
1. Open Jules, pick this repo, branch `main`, and give it a task. It reads `AGENTS.md` and a brief from `briefs/`.
2. Jules writes the code on a new branch.
3. On GitHub: **Actions** tab, **Render video**, **Run workflow**. In "Use workflow from" choose Jules's branch.
4. When the run turns green, open it and download the video from **Artifacts** (the file is a zip containing the MP4).
5. If the run fails, open it, copy the red error text and paste it into the same Jules task so it can fix the code. Then run the workflow again.

## First test (before using Jules)
Run the workflow on `main`. You should get a 30-second "PIPELINE OK" placeholder video. If that works, the pipeline is fine.

## Folders
- `skills/` official Remotion skills for coding agents
- `briefs/` video briefs (frame by frame)
- `src/` the video code
- `.github/workflows/render.yml` the render button
