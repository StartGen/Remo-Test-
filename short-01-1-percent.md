# Brief: "1% Better Every Day" — 30-second vertical Short (no voiceover, no audio)

Replace the placeholder in `src/Short30.tsx`. Keep `export const Short30` and the registration `id="Short30"` in `src/Root.tsx`.

## Hard specs
- 1080 x 1920, 30 fps, exactly 900 frames (30.0 s). No audio track.
- Language: Hinglish in Roman script. Use the strings below exactly. Do not translate or "correct" them.
- Safe zones for YouTube Shorts: keep text and key shapes inside x 70–1010 and y 280–1540. Keep the right edge (x > 930) clear between y 1100 and 1700.
- Everything is drawn in code. No images, footage or audio files.

## Design system
- Colors: BG `#0A0E17`, panel `#111827`, grid `#1E2A3D`, text `#F4F6FA`, muted `#8B97AD`, green `#1FE08F`, red `#FF4A5A`, amber `#FFC83D` (highlighter only).
- Fonts (via `@remotion/google-fonts`): Bebas Neue for headlines, Inter (weight 800, tabular numerals) for numbers and small text. If a font fails to load, fall back to a bold sans-serif and say so in your report.
- Motion: springs for entrances (damping 12–16), exponential ease-out for count-ups, fast ease-in-out for exits. Impacts get a short screen shake (deterministic, decaying over about 8 frames).
- Persistent background for all 900 frames: BG color, faint grid lines every 90 px drifting upward at 0.5 px per frame, and 24 tiny dust particles (seeded with `random()`, slow drift, opacity 0.1–0.3).

## Timeline (frame numbers are inside the composition, 0-based)

### Scene 1 — Hook, frames 0–89
- 0–12: a 4 px green horizontal line at y=960 grows from the centre outward to full width.
- 6–24: huge "1%" (Bebas, about 640 px, green, centred near y=820) slams in. Spring scale 2.6 to 1. Opacity 0 to 1 over frames 6–9.
- 8–20: shockwave ring (green stroke, 10 px) expands from the "1%" (radius 120 to 900, opacity 0.6 to 0). Whole scene shakes, amplitude 18 px decaying to 0.
- 30–58: line "ROZ SIRF 1% BEHTAR." near y=1180, Bebas 150 px, word by word every 6 frames (ROZ at 30, SIRF 36, 1% 42, BEHTAR 48). Each word rises 40 px and fades in. "BEHTAR" is green, the rest white.
- 62–80: the big "1%" and the line scale down and fade out. "365 DIN BAAD?" slams in at 64 (Bebas 200 px, "365" amber, "?" pulses between scale 1 and 1.25 from frame 80).
- 80–99: transition to Scene 2. A diagonal green wipe covers the screen over 80–89 and uncovers Scene 2 over 90–99.

### Scene 2 — Two paths, frames 90–209
- 96–110: "DO RAASTE." drops in at the top (y about 360, Bebas 170 px, white).
- 112–135: green card slides in from the left (translateX -1100 to 0, spring). Card 920x340 at y 560–900, 4 px green border, green at 12% opacity fill, radius 40. Inside: an up-arrow icon that draws itself, the text "ROZ 1% BEHTAR" (Bebas 130 px, green) and below it "1.01 × 1.01 × 1.01 …" (Inter 44 px, muted).
- 135–158: red card slides in from the right at y 1000–1340 with the same layout. Text "ROZ 1% KHARAB", sub "0.99 × 0.99 × 0.99 …", down-arrow icon, red.
- 150–165: a white circle badge (120 px) with "VS" (Bebas 70, dark text) pops between the cards at y about 950 (spring scale 0 to 1).
- 190–205: both cards slide out (green to the left, red to the right). The "DO RAASTE." title fades out.

### Scene 3 — The race chart, frames 210–569
Layout: chart area x 90–990, y 560–1360. Baseline (0x) at y=1360, top (40x) at y=560, so 20 px per 1x. X axis = days 0–365 mapped to x 90–990.
- 210–239: axis lines and four dashed grid lines draw on. Y labels "0x 10x 20x 30x 40x" and X labels "0 100 200 300 365" (Inter 36 px, muted) appear one after another.
- Header (y 330–480): "DIN" label plus a large day counter (Bebas 220 px, tabular numerals) that shows the current day, 0 to 365.
- 240–539: `day = 365 * ease(t)` with ease-in-out (cubic bezier 0.45, 0, 0.55, 1) over frames 240–540. Two lines grow with the real formulas, green `1.01^day` and red `0.99^day`, as 10 px round-capped SVG paths up to the current day. A glowing dot (layered rings, no blur) leads each line.
- Live pills at the top-left inside the chart: "BEHTAR 1.00x" (green) and "KHARAB 1.00x" (red). They update every frame with 2 decimals.
- One callout slot below the chart (y 1400–1520). Each callout appears when the day counter crosses its day, springs in, stays about 60 frames, then crossfades to the next:
  - Day 30: "DIN 30 · 1.35x vs 0.74x" and "Abhi kuch khaas nahi dikhta."
  - Day 100: "DIN 100 · 2.70x vs 0.37x" and "Abhi bhi kam lagta hai."
  - Day 200: "DIN 200 · 7.32x vs 0.13x" and "Ab farak dikhne laga."
- From day 250: slow camera push-in on the green tip (scale 1 to 1.12 until frame 539) and 30 seeded ember particles rising from the tip.
- 540–548: day 365 reached. Final pills "BEHTAR 37.78x" and "KHARAB 0.03x". White flash (opacity 0.35 to 0) and a 6-frame shake.
- 550–569: zoom-through exit. The chart group scales 1 to 2.5 while fading out.

### Scene 4 — Reveal, frames 570–749
- 570–585: split screen. Top half (y 0–960, tinted dark green `#0F2A20`) slides down from above, bottom half (y 960–1920, tinted dark red `#2A0F14`) slides up from below (springs).
- Top: "EK SAAL BAAD" (Inter 44 px, muted, y about 360), then a count-up from 1.00 to 37.78 over frames 580–640 with exponential ease-out. Bebas 380 px, green, suffix "x". Green sparks rise in this half.
- Bottom: "EK SAAL BAAD", then a count-down from 1.00 to 0.03 over the same frames. Bebas 380 px, red, suffix "x". Red ash particles fall in this half, and the panel sinks about 20 px.
- 640–655: top caption "37 GUNA BEHTAR" (Bebas 110 px, white) with an amber highlighter swipe. Bottom caption "LAGBHAG ZERO" (Bebas 110 px, white) with a small shake.
- 735–749: the top half slides up and the bottom half slides down, revealing the base background.

### Scene 5 — The lesson, frames 750–839
- 750–780: "1% CHHOTA" then "LAGTA HAI." as two stacked lines (Bebas 190 px, white), each slamming in with a spring, about 6 frames apart, around y 700–1100.
- 786–825: "PAR SAAL BHAR MEIN" (Inter 800, 90 px, white) and below it "37 GUNA" (Bebas 300 px, green) with an amber highlighter swipe behind it.
- 830–839: all text slides off to the left.

### Scene 6 — Call to action and loop, frames 840–899
- 840–860: "AAJ TERA" / "1% KYA" / "HAI?" stacked (Bebas 200 px), 5 frames apart. "1%" is green.
- 860–884: the green "1%" pulses gently (scale 1 to 1.08 and back).
- 885–899: everything fades out until the last frame equals frame 0 (background plus the thin green line at the centre), so the Short loops cleanly.

## Chart math (use real formulas, not hard-coded curves)
| Day | Green 1.01^day | Red 0.99^day |
|-----|----------------|--------------|
| 0 | 1.00 | 1.00 |
| 30 | 1.35 | 0.74 |
| 100 | 2.70 | 0.37 |
| 200 | 7.32 | 0.13 |
| 300 | 19.79 | 0.05 |
| 365 | 37.78 | 0.03 |

## Structure
- `src/Short30.tsx` composes the six scenes with `<Sequence from durationInFrames>`.
- Scenes in `src/scenes/`, shared colors and fonts in `src/theme.ts`, chart helpers in `src/chart.ts`.
- Total length must stay exactly 900 frames. If you use `TransitionSeries.Transition`, remember it shortens the timeline: scene durations minus transition durations must equal 900. Overlay-based wipes (or `TransitionSeries.Overlay`) do not shorten it.

## Acceptance checklist
- [ ] `npx tsc --noEmit` passes
- [ ] `npx remotion compositions src/index.ts` lists `Short30` at 1080x1920, 30 fps, 900 frames
- [ ] No `Math.random`, `Date.now`, CSS animation or transition anywhere in `src/`
- [ ] No blur, drop-shadow or backdrop-filter
- [ ] All strings match this brief exactly
- [ ] Nothing important outside the safe zones
- [ ] Last frame matches frame 0
