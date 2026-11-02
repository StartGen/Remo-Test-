import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, FONTS} from "../theme";
import {
  CHART_BOUNDS,
  calcGreen,
  calcRed,
  chartDayEasing,
  dayToX,
  valToY,
} from "../chart";
import {getShake} from "./Scene1";

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 359 (mapped to global 210 to 569)
  const {fps} = useVideoConfig();

  // 210–239 (rel 0–29): axis lines and 4 dashed grid lines draw on.
  // Y labels "0x 10x 20x 30x 40x" and X labels "0 100 200 300 365" appear one after another.
  const axisProgress = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Header (y 330–480): "DIN" label plus large day counter (Bebas 220 px)
  // Day counter runs 240–539 (rel 30–329) with ease-in-out cubic bezier (0.45, 0, 0.55, 1)
  const dayProgress = interpolate(frame, [30, 330], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: chartDayEasing,
  });
  const currentDay = 365 * dayProgress;
  const displayDay = Math.floor(currentDay);

  const greenVal = calcGreen(currentDay);
  const redVal = calcRed(currentDay);

  // SVG Paths for Green and Red lines up to currentDay
  // Sample every integer day up to currentDay, plus the exact floating end point
  const greenPoints: string[] = [];
  const redPoints: string[] = [];

  const maxSample = Math.min(365, Math.floor(currentDay));
  for (let d = 0; d <= maxSample; d++) {
    const x = dayToX(d);
    const yG = valToY(calcGreen(d));
    const yR = valToY(calcRed(d));
    greenPoints.push(`${x.toFixed(1)},${yG.toFixed(1)}`);
    redPoints.push(`${x.toFixed(1)},${yR.toFixed(1)}`);
  }
  if (currentDay > maxSample) {
    const x = dayToX(currentDay);
    const yG = valToY(greenVal);
    const yR = valToY(redVal);
    greenPoints.push(`${x.toFixed(1)},${yG.toFixed(1)}`);
    redPoints.push(`${x.toFixed(1)},${yR.toFixed(1)}`);
  }

  const greenPathD =
    greenPoints.length > 0 ? `M ${greenPoints.join(" L ")}` : "";
  const redPathD = redPoints.length > 0 ? `M ${redPoints.join(" L ")}` : "";

  // Head coordinates for glowing leading dots
  const greenHeadX = dayToX(currentDay);
  const greenHeadY = valToY(greenVal);
  const redHeadX = dayToX(currentDay);
  const redHeadY = valToY(redVal);

  // Callouts below the chart (y 1400–1520):
  // Day 30: "DIN 30 · 1.35x vs 0.74x" / "Abhi kuch khaas nahi dikhta."
  // Day 100: "DIN 100 · 2.70x vs 0.37x" / "Abhi bhi kam lagta hai."
  // Day 200: "DIN 200 · 7.32x vs 0.13x" / "Ab farak dikhne laga."
  // Each appears when counter crosses its day, springs in, stays ~60 frames, crossfades.
  // We can track exact appearance frame when currentDay crosses 30, 100, 200
  // Day 30 is crossed around rel frame 105
  // Day 100 is crossed around rel frame 160
  // Day 200 is crossed around rel frame 215
  // Day 250 is crossed around rel frame 243
  const callouts = [
    {
      targetDay: 30,
      title: "DIN 30 · 1.35x vs 0.74x",
      desc: "Abhi kuch khaas nahi dikhta.",
    },
    {
      targetDay: 100,
      title: "DIN 100 · 2.70x vs 0.37x",
      desc: "Abhi bhi kam lagta hai.",
    },
    {
      targetDay: 200,
      title: "DIN 200 · 7.32x vs 0.13x",
      desc: "Ab farak dikhne laga.",
    },
  ];

  // Active callout logic
  let activeCalloutIndex = -1;
  if (currentDay >= 200) {
    activeCalloutIndex = 2;
  } else if (currentDay >= 100) {
    activeCalloutIndex = 1;
  } else if (currentDay >= 30) {
    activeCalloutIndex = 0;
  }

  // Camera push-in from day 250 (rel ~245 to 329): scale 1 to 1.12
  // Center of zoom: green tip near (greenHeadX, greenHeadY)
  const isPushIn = currentDay >= 250;
  const pushInProgress = interpolate(currentDay, [250, 365], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraScale = interpolate(pushInProgress, [0, 1], [1, 1.12]);

  // 30 seeded ember particles rising from the tip from day 250
  const embers = React.useMemo(() => {
    return Array.from({length: 30}).map((_, i) => {
      const angle = random(`ember-angle-${i}`) * Math.PI - Math.PI; // upward spread
      const speed = 2 + random(`ember-spd-${i}`) * 4;
      const size = 3 + random(`ember-sz-${i}`) * 4;
      const life = 20 + random(`ember-life-${i}`) * 25;
      const offsetFrame = Math.floor(random(`ember-off-${i}`) * 30);
      return {angle, speed, size, life, offsetFrame};
    });
  }, []);

  // 540–548 (rel 330–338): Day 365 reached! White flash (opacity 0.35 to 0) + 6-frame shake
  const flashOpacity = interpolate(frame, [330, 338], [0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake365 = getShake(frame, 330, 6, 12);

  // 550–569 (rel 340–359): zoom-through exit. The chart group scales 1 to 2.5 while fading out
  const exitScale = interpolate(frame, [340, 359], [1, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [340, 359], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const yGridLines = [10, 20, 30, 40];
  const yLabels = [
    {val: 0, label: "0x"},
    {val: 10, label: "10x"},
    {val: 20, label: "20x"},
    {val: 30, label: "30x"},
    {val: 40, label: "40x"},
  ];
  const xLabels = [
    {day: 0, label: "0"},
    {day: 100, label: "100"},
    {day: 200, label: "200"},
    {day: 300, label: "300"},
    {day: 365, label: "365"},
  ];

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shake365.x}px, ${shake365.y}px)`,
        pointerEvents: "none",
      }}
    >
      {/* Zoom / Scale container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${cameraScale * exitScale})`,
          transformOrigin: isPushIn
            ? `${greenHeadX}px ${greenHeadY}px`
            : "540px 960px",
          opacity: exitOpacity,
        }}
      >
        {/* Header: DIN label + Large Day Counter */}
        <div
          style={{
            position: "absolute",
            top: 320,
            left: 90,
            right: 90,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.headline,
              fontSize: 60,
              color: COLORS.muted,
              letterSpacing: "0.1em",
            }}
          >
            DIN
          </div>
          <div
            style={{
              fontFamily: FONTS.headline,
              fontSize: 220,
              lineHeight: 1,
              color: COLORS.text,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {displayDay}
          </div>
        </div>

        {/* Live pills inside chart at top-left: y about 580, x 110 */}
        <div
          style={{
            position: "absolute",
            top: 575,
            left: 110,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 10,
          }}
        >
          {/* Green pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: 16,
              backgroundColor: "rgba(31, 224, 143, 0.16)",
              border: `1.5px solid ${COLORS.green}`,
              fontFamily: FONTS.headline,
              fontSize: 34,
              color: COLORS.green,
              letterSpacing: "0.04em",
            }}
          >
            BEHTAR {greenVal.toFixed(2)}x
          </div>

          {/* Red pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: 16,
              backgroundColor: "rgba(255, 74, 90, 0.16)",
              border: `1.5px solid ${COLORS.red}`,
              fontFamily: FONTS.headline,
              fontSize: 34,
              color: COLORS.red,
              letterSpacing: "0.04em",
            }}
          >
            KHARAB {redVal.toFixed(2)}x
          </div>
        </div>

        {/* Chart SVG Canvas */}
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1080,
            height: 1920,
          }}
        >
          {/* Dashed grid lines */}
          {yGridLines.map((val) => {
            const y = valToY(val);
            return (
              <line
                key={val}
                x1={CHART_BOUNDS.xMin}
                y1={y}
                x2={CHART_BOUNDS.xMax}
                y2={y}
                stroke={COLORS.grid}
                strokeWidth={1.5}
                strokeDasharray="8 8"
                opacity={axisProgress * 0.7}
              />
            );
          })}

          {/* Baseline (0x) line at y=1360 */}
          <line
            x1={CHART_BOUNDS.xMin}
            y1={CHART_BOUNDS.baselineY}
            x2={CHART_BOUNDS.xMin + CHART_BOUNDS.width * axisProgress}
            y2={CHART_BOUNDS.baselineY}
            stroke={COLORS.muted}
            strokeWidth={2.5}
          />

          {/* Left Y-axis line */}
          <line
            x1={CHART_BOUNDS.xMin}
            y1={CHART_BOUNDS.baselineY}
            x2={CHART_BOUNDS.xMin}
            y2={CHART_BOUNDS.baselineY - CHART_BOUNDS.height * axisProgress}
            stroke={COLORS.muted}
            strokeWidth={2.5}
          />

          {/* Red path */}
          {redPathD && (
            <path
              d={redPathD}
              fill="none"
              stroke={COLORS.red}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Green path */}
          {greenPathD && (
            <path
              d={greenPathD}
              fill="none"
              stroke={COLORS.green}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Glowing leading dot: Green */}
          {frame >= 30 && (
            <g transform={`translate(${greenHeadX}, ${greenHeadY})`}>
              {/* Outer faint ring */}
              <circle r={26} fill={COLORS.green} opacity={0.18} />
              {/* Mid ring */}
              <circle r={16} fill={COLORS.green} opacity={0.4} />
              {/* Core solid circle */}
              <circle r={8} fill="#FFFFFF" />
            </g>
          )}

          {/* Glowing leading dot: Red */}
          {frame >= 30 && (
            <g transform={`translate(${redHeadX}, ${redHeadY})`}>
              <circle r={22} fill={COLORS.red} opacity={0.18} />
              <circle r={14} fill={COLORS.red} opacity={0.4} />
              <circle r={7} fill="#FFFFFF" />
            </g>
          )}

          {/* 30 Rising ember particles from day 250 */}
          {isPushIn &&
            embers.map((emb, i) => {
              const cycleFrame = (frame + emb.offsetFrame) % emb.life;
              const p = cycleFrame / emb.life;
              const ex = greenHeadX + Math.cos(emb.angle) * emb.speed * cycleFrame;
              const ey =
                greenHeadY +
                Math.sin(emb.angle) * emb.speed * cycleFrame -
                cycleFrame * 1.5;
              const op = (1 - p) * 0.7;
              return (
                <circle
                  key={i}
                  cx={ex}
                  cy={ey}
                  r={emb.size * (1 - p * 0.4)}
                  fill={COLORS.green}
                  opacity={op}
                />
              );
            })}
        </svg>

        {/* Y Axis Labels */}
        {yLabels.map((lbl, idx) => {
          const appearProgress = interpolate(
            frame,
            [idx * 4, idx * 4 + 8],
            [0, 1],
            {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
          );
          return (
            <div
              key={lbl.val}
              style={{
                position: "absolute",
                top: valToY(lbl.val) - 18,
                left: 14,
                width: 70,
                textAlign: "right",
                fontFamily: FONTS.body,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                fontSize: 34,
                color: COLORS.muted,
                opacity: appearProgress,
              }}
            >
              {lbl.label}
            </div>
          );
        })}

        {/* X Axis Labels */}
        {xLabels.map((lbl, idx) => {
          const appearProgress = interpolate(
            frame,
            [12 + idx * 4, 12 + idx * 4 + 8],
            [0, 1],
            {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
          );
          return (
            <div
              key={lbl.day}
              style={{
                position: "absolute",
                top: CHART_BOUNDS.baselineY + 16,
                left: dayToX(lbl.day) - 40,
                width: 80,
                textAlign: "center",
                fontFamily: FONTS.body,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                fontSize: 34,
                color: COLORS.muted,
                opacity: appearProgress,
              }}
            >
              {lbl.label}
            </div>
          );
        })}

        {/* Callout slot below the chart: y 1400–1520 */}
        <div
          style={{
            position: "absolute",
            top: 1400,
            left: 90,
            right: 90,
            height: 120,
            display: "flex",
            alignItems: "center",
          }}
        >
          {callouts.map((c, i) => {
            const isCurrent = activeCalloutIndex === i;
            // When becomes active, springs in
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  opacity: isCurrent ? 1 : 0,
                  transform: isCurrent ? "translateY(0)" : "translateY(15px)",
                  transition: "none",
                  display: isCurrent ? "flex" : "none",
                  flexDirection: "column",
                  gap: 8,
                  backgroundColor: COLORS.panel,
                  border: `2px solid ${COLORS.grid}`,
                  borderRadius: 24,
                  padding: "20px 32px",
                }}
              >
                <div
                  style={{
                    fontFamily: FONTS.headline,
                    fontSize: 48,
                    letterSpacing: "0.03em",
                    color: COLORS.amber,
                  }}
                >
                  {c.title}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: 600,
                    fontSize: 36,
                    color: COLORS.text,
                  }}
                >
                  {c.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* White flash at day 365 (rel 330–338) */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            opacity: flashOpacity,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
