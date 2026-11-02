import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, FONTS} from "../theme";

// Deterministic screen shake
export const getShake = (frame: number, startFrame: number, duration: number, maxAmp: number) => {
  if (frame < startFrame || frame >= startFrame + duration) {
    return {x: 0, y: 0};
  }
  const t = frame - startFrame;
  const decay = 1 - t / duration;
  const amp = maxAmp * decay;
  // Deterministic pseudo-random pattern based on sin/cos
  const x = Math.sin(t * 4.3) * amp;
  const y = Math.cos(t * 3.7) * amp;
  return {x, y};
};

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 0–12: 4px green horizontal line at y=960 grows from center outward to full width (1080)
  const lineWidth = interpolate(frame, [0, 12], [0, 1080], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineOpacity = interpolate(frame, [62, 75], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 6–24: huge "1%" slams in. Spring scale 2.6 to 1. Opacity 0 to 1 over 6–9.
  const onePercentSpring = spring({
    frame: frame - 6,
    fps,
    config: {damping: 14, mass: 1, stiffness: 180},
  });
  const onePercentScale = interpolate(onePercentSpring, [0, 1], [2.6, 1]);
  const onePercentOpacity = interpolate(frame, [6, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 8–20: shockwave ring (green stroke, 10 px) expands from "1%" (radius 120 to 900, opacity 0.6 to 0)
  const ringRadius = interpolate(frame, [8, 20], [120, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(frame, [8, 20], [0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shake at frame 8 decaying over 12 frames (amplitude 18px decaying to 0)
  const shake = getShake(frame, 8, 12, 18);

  // 30–58: line "ROZ SIRF 1% BEHTAR." near y=1180, Bebas 150 px, word by word every 6 frames
  // (ROZ at 30, SIRF 36, 1% 42, BEHTAR 48). Each word rises 40 px and fades in.
  const words = [
    {text: "ROZ", start: 30, color: COLORS.text},
    {text: "SIRF", start: 36, color: COLORS.text},
    {text: "1%", start: 42, color: COLORS.text},
    {text: "BEHTAR.", start: 48, color: COLORS.green},
  ];

  // 62–80: big "1%" and the line scale down and fade out
  const exitScale = interpolate(frame, [62, 78], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitOpacity = interpolate(frame, [62, 78], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "365 DIN BAAD?" slams in at 64 (Bebas 200 px, "365" amber, "?" pulses between scale 1 and 1.25 from frame 80)
  const baadSpring = spring({
    frame: frame - 64,
    fps,
    config: {damping: 14, mass: 1, stiffness: 200},
  });
  const baadScale = interpolate(baadSpring, [0, 1], [2.2, 1]);
  const baadOpacity = interpolate(frame, [64, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "?" pulse from frame 80 between 1 and 1.25 (sin wave)
  const questionScale =
    frame >= 80
      ? 1 + 0.125 + 0.125 * Math.sin((frame - 80) * 0.45)
      : 1;

  // 80–89: diagonal green wipe covers screen over 80–89
  // Over 80-89: progress 0 to 1
  const wipeProgress = interpolate(frame, [80, 89], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shake.x}px, ${shake.y}px)`,
        pointerEvents: "none",
      }}
    >
      {/* Expanding green horizontal line */}
      {frame >= 0 && frame <= 78 && (
        <div
          style={{
            position: "absolute",
            top: 960 - 2,
            left: 540 - lineWidth / 2,
            width: lineWidth,
            height: 4,
            backgroundColor: COLORS.green,
            opacity: lineOpacity,
          }}
        />
      )}

      {/* Shockwave ring */}
      {frame >= 8 && frame <= 20 && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1080,
            height: 1920,
          }}
        >
          <circle
            cx={540}
            cy={820}
            r={ringRadius}
            fill="none"
            stroke={COLORS.green}
            strokeWidth={10}
            opacity={ringOpacity}
          />
        </svg>
      )}

      {/* Big "1%" */}
      {frame >= 6 && frame <= 80 && (
        <div
          style={{
            position: "absolute",
            top: 500,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: FONTS.headline,
            fontSize: 640,
            lineHeight: 1,
            color: COLORS.green,
            opacity: onePercentOpacity * exitOpacity,
            transform: `scale(${onePercentScale * exitScale})`,
            transformOrigin: "center center",
          }}
        >
          1%
        </div>
      )}

      {/* "ROZ SIRF 1% BEHTAR." */}
      {frame >= 30 && frame <= 80 && (
        <div
          style={{
            position: "absolute",
            top: 1140,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            gap: 28,
            fontFamily: FONTS.headline,
            fontSize: 150,
            lineHeight: 1,
            opacity: exitOpacity,
            transform: `scale(${exitScale})`,
            transformOrigin: "center center",
          }}
        >
          {words.map((w, i) => {
            const wProg = interpolate(frame, [w.start, w.start + 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const wY = interpolate(wProg, [0, 1], [40, 0]);
            return (
              <span
                key={i}
                style={{
                  color: w.color,
                  opacity: wProg,
                  transform: `translateY(${wY}px)`,
                  display: "inline-block",
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      )}

      {/* "365 DIN BAAD?" */}
      {frame >= 64 && (
        <div
          style={{
            position: "absolute",
            top: 840,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: FONTS.headline,
            fontSize: 200,
            lineHeight: 1,
            color: COLORS.text,
            opacity: baadOpacity,
            transform: `scale(${baadScale})`,
            transformOrigin: "center center",
          }}
        >
          <span style={{color: COLORS.amber}}>365</span>
          <span style={{margin: "0 24px"}}>DIN BAAD</span>
          <span
            style={{
              display: "inline-block",
              transform: `scale(${questionScale})`,
              transformOrigin: "center center",
              color: COLORS.amber,
            }}
          >
            ?
          </span>
        </div>
      )}

      {/* Diagonal green wipe covering screen over 80–89 */}
      {frame >= 80 && wipeProgress > 0 && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1080,
            height: 1920,
            zIndex: 100,
          }}
        >
          <polygon
            points={`
              -200,${-300 + wipeProgress * 2600}
              1280,${-300 + wipeProgress * 2600 - 600}
              1280,0
              0,0
            `}
            fill={COLORS.green}
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};
