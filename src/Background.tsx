import React from "react";
import {AbsoluteFill, random, useCurrentFrame} from "remotion";
import {COLORS} from "./theme";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  // Grid lines every 90 px drifting upward at 0.5 px per frame
  // Drift offset = (frame * 0.5) % 90
  const gridOffset = (frame * 0.5) % 90;

  // 24 tiny dust particles (seeded with random(), slow drift, opacity 0.1-0.3)
  const particles = React.useMemo(() => {
    return Array.from({length: 24}).map((_, i) => {
      const xBase = random(`dust-x-${i}`) * 1080;
      const yBase = random(`dust-y-${i}`) * 1920;
      const speedY = 0.2 + random(`dust-speed-${i}`) * 0.4; // 0.2 to 0.6 px/frame upward
      const size = 2 + random(`dust-size-${i}`) * 3;
      const baseOpacity = 0.1 + random(`dust-op-${i}`) * 0.2;
      return {xBase, yBase, speedY, size, baseOpacity};
    });
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        overflow: "hidden",
      }}
    >
      {/* Grid lines */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1920,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="bg-grid"
            width="90"
            height="90"
            patternUnits="userSpaceOnUse"
            y={-gridOffset}
          >
            <path
              d="M 90 0 L 0 0 0 90"
              fill="none"
              stroke={COLORS.grid}
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#bg-grid)" />
      </svg>

      {/* Dust particles */}
      {particles.map((p, i) => {
        const y = (p.yBase - frame * p.speedY) % 1920;
        const normalizedY = y < 0 ? y + 1920 : y;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.xBase,
              top: normalizedY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: COLORS.text,
              opacity: p.baseOpacity,
              pointerEvents: "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
