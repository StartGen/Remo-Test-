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
import {getShake} from "./Scene1";

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 179 (mapped to global 570 to 749)
  const {fps} = useVideoConfig();

  // 570–585 (rel 0–15): split screen slides in.
  // Top half (y 0–960, tinted #0F2A20) slides down from above.
  // Bottom half (y 960–1920, tinted #2A0F14) slides up from below.
  const splitEntrance = spring({
    frame,
    fps,
    config: {damping: 14, mass: 1, stiffness: 180},
  });
  const topSlideInY = interpolate(splitEntrance, [0, 1], [-960, 0]);
  const bottomSlideInY = interpolate(splitEntrance, [0, 1], [960, 0]);

  // 735–749 (rel 165–179): top half slides up, bottom slides down
  const splitExitProgress = interpolate(frame, [165, 179], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const topExitY = interpolate(splitExitProgress, [0, 1], [0, -960]);
  const bottomExitY = interpolate(splitExitProgress, [0, 1], [0, 960]);

  // Count-up (top) 1.00 to 37.78 over frames 580–640 (rel 10–70) with exponential ease-out
  // Count-down (bottom) 1.00 to 0.03 over same frames
  // Exponential ease-out: 1 - Math.pow(2, -10 * t)
  const countT = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const expEaseOut = countT === 1 ? 1 : 1 - Math.pow(2, -10 * countT);
  const greenCount = 1.0 + (37.78 - 1.0) * expEaseOut;
  const redCount = 1.0 - (1.0 - 0.03) * expEaseOut;

  // Bottom panel sinks about 20px over the count-down
  const bottomSinkY = interpolate(countT, [0, 1], [0, 20]);

  // 640–655 (rel 70–85):
  // Top caption "37 GUNA BEHTAR" (Bebas 110 px, white) with amber highlighter swipe.
  // Bottom caption "LAGBHAG ZERO" (Bebas 110 px, white) with small shake.
  const captionEntrance = interpolate(frame, [70, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const highlightWidth = interpolate(frame, [75, 87], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Small shake for bottom caption at rel 70-80
  const zeroShake = getShake(frame, 70, 10, 6);

  // Sparks rising in top half (green)
  const sparks = React.useMemo(() => {
    return Array.from({length: 20}).map((_, i) => {
      const x = random(`spark-x-${i}`) * 900 + 90;
      const speed = 1.5 + random(`spark-spd-${i}`) * 2.5;
      const size = 3 + random(`spark-sz-${i}`) * 4;
      const startOffset = Math.floor(random(`spark-off-${i}`) * 50);
      return {x, speed, size, startOffset};
    });
  }, []);

  // Ash falling in bottom half (red)
  const ashes = React.useMemo(() => {
    return Array.from({length: 20}).map((_, i) => {
      const x = random(`ash-x-${i}`) * 900 + 90;
      const speed = 1.2 + random(`ash-spd-${i}`) * 2.0;
      const size = 3 + random(`ash-sz-${i}`) * 3;
      const startOffset = Math.floor(random(`ash-off-${i}`) * 50);
      return {x, speed, size, startOffset};
    });
  }, []);

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {/* TOP HALF (y 0–960) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 960,
          backgroundColor: COLORS.topHalf,
          borderBottom: `2px solid ${COLORS.green}`,
          transform: `translateY(${topSlideInY + topExitY}px)`,
          overflow: "hidden",
        }}
      >
        {/* Green sparks */}
        {sparks.map((s, i) => {
          const sparkY = 960 - (((frame + s.startOffset) * s.speed * 4) % 960);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.x,
                top: sparkY,
                width: s.size,
                height: s.size,
                borderRadius: "50%",
                backgroundColor: COLORS.green,
                opacity: 0.45,
              }}
            />
          );
        })}

        {/* Top "EK SAAL BAAD" (Inter 44 px, muted, y about 360 - relative y ~140) */}
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: FONTS.body,
            fontWeight: 800,
            fontSize: 44,
            color: COLORS.muted,
            letterSpacing: "0.08em",
          }}
        >
          EK SAAL BAAD
        </div>

        {/* Count-up 37.78x (Bebas 380 px, green) */}
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: FONTS.headline,
            fontSize: 380,
            lineHeight: 1,
            color: COLORS.green,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {greenCount.toFixed(2)}x
        </div>

        {/* Top caption "37 GUNA BEHTAR" (Bebas 110 px, white) with amber highlighter swipe */}
        {frame >= 70 && (
          <div
            style={{
              position: "absolute",
              top: 660,
              left: 0,
              width: 1080,
              display: "flex",
              justifyContent: "center",
              opacity: captionEntrance,
            }}
          >
            <div style={{position: "relative", display: "inline-block"}}>
              {/* Amber highlighter swipe behind text */}
              <div
                style={{
                  position: "absolute",
                  left: -12,
                  bottom: 8,
                  width: `${highlightWidth}%`,
                  height: 38,
                  backgroundColor: COLORS.amber,
                  opacity: 0.85,
                  borderRadius: 4,
                  zIndex: 0,
                }}
              />
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontFamily: FONTS.headline,
                  fontSize: 110,
                  lineHeight: 1,
                  color: COLORS.text,
                  letterSpacing: "0.02em",
                }}
              >
                37 GUNA BEHTAR
              </span>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM HALF (y 960–1920) */}
      <div
        style={{
          position: "absolute",
          top: 960,
          left: 0,
          width: 1080,
          height: 960,
          backgroundColor: COLORS.bottomHalf,
          borderTop: `2px solid ${COLORS.red}`,
          transform: `translateY(${bottomSlideInY + bottomExitY + bottomSinkY + zeroShake.y}px) translateX(${zeroShake.x}px)`,
          overflow: "hidden",
        }}
      >
        {/* Red ash particles falling */}
        {ashes.map((a, i) => {
          const ashY = ((frame + a.startOffset) * a.speed * 4) % 960;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: a.x,
                top: ashY,
                width: a.size,
                height: a.size,
                borderRadius: "50%",
                backgroundColor: COLORS.red,
                opacity: 0.4,
              }}
            />
          );
        })}

        {/* Bottom "EK SAAL BAAD" (Inter 44 px, muted, rel y ~140) */}
        <div
          style={{
            position: "absolute",
            top: 140,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: FONTS.body,
            fontWeight: 800,
            fontSize: 44,
            color: COLORS.muted,
            letterSpacing: "0.08em",
          }}
        >
          EK SAAL BAAD
        </div>

        {/* Count-down 0.03x (Bebas 380 px, red) */}
        <div
          style={{
            position: "absolute",
            top: 220,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: FONTS.headline,
            fontSize: 380,
            lineHeight: 1,
            color: COLORS.red,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {redCount.toFixed(2)}x
        </div>

        {/* Bottom caption "LAGBHAG ZERO" (Bebas 110 px, white) */}
        {frame >= 70 && (
          <div
            style={{
              position: "absolute",
              top: 660,
              left: 0,
              width: 1080,
              textAlign: "center",
              fontFamily: FONTS.headline,
              fontSize: 110,
              lineHeight: 1,
              color: COLORS.text,
              opacity: captionEntrance,
              letterSpacing: "0.02em",
            }}
          >
            LAGBHAG ZERO
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
