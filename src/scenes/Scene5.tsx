import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, FONTS} from "../theme";

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 89 (mapped to global 750 to 839)
  const {fps} = useVideoConfig();

  // 750–780 (rel 0–30): "1% CHHOTA" then "LAGTA HAI." as two stacked lines (Bebas 190 px, white)
  // slamming in with a spring, about 6 frames apart, around y 700–1100.
  const spring1 = spring({
    frame: frame - 0,
    fps,
    config: {damping: 14, mass: 1, stiffness: 200},
  });
  const scale1 = interpolate(spring1, [0, 1], [2.2, 1]);
  const op1 = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spring2 = spring({
    frame: frame - 6,
    fps,
    config: {damping: 14, mass: 1, stiffness: 200},
  });
  const scale2 = interpolate(spring2, [0, 1], [2.2, 1]);
  const op2 = interpolate(frame, [6, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out of "1% CHHOTA LAGTA HAI." before next phrase at rel 36 (frame 786)
  const firstPhraseFade = interpolate(frame, [30, 36], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 786–825 (rel 36–75): "PAR SAAL BHAR MEIN" (Inter 800, 90 px, white)
  // and below it "37 GUNA" (Bebas 300 px, green) with amber highlighter swipe behind it.
  const spring3 = spring({
    frame: frame - 36,
    fps,
    config: {damping: 14, mass: 1, stiffness: 180},
  });
  const scale3 = interpolate(spring3, [0, 1], [1.8, 1]);
  const op3 = interpolate(frame, [36, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Amber highlighter swipe behind "37 GUNA"
  const gunaHighlight = interpolate(frame, [42, 54], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 830–839 (rel 80–89): all text slides off to the left
  const exitSlide = interpolate(frame, [80, 89], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitX = interpolate(exitSlide, [0, 1], [0, -1150]);

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${exitX}px)`,
        pointerEvents: "none",
      }}
    >
      {/* First phrase: "1% CHHOTA LAGTA HAI." */}
      {frame < 36 && (
        <div
          style={{
            position: "absolute",
            top: 720,
            left: 0,
            width: 1080,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            opacity: firstPhraseFade,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.headline,
              fontSize: 190,
              lineHeight: 1,
              color: COLORS.text,
              opacity: op1,
              transform: `scale(${scale1})`,
              transformOrigin: "center center",
            }}
          >
            1% CHHOTA
          </div>
          {frame >= 6 && (
            <div
              style={{
                fontFamily: FONTS.headline,
                fontSize: 190,
                lineHeight: 1,
                color: COLORS.text,
                opacity: op2,
                transform: `scale(${scale2})`,
                transformOrigin: "center center",
              }}
            >
              LAGTA HAI.
            </div>
          )}
        </div>
      )}

      {/* Second phrase: "PAR SAAL BHAR MEIN" / "37 GUNA" */}
      {frame >= 36 && (
        <div
          style={{
            position: "absolute",
            top: 680,
            left: 0,
            width: 1080,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
            opacity: op3,
            transform: `scale(${scale3})`,
            transformOrigin: "center center",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: 800,
              fontSize: 90,
              lineHeight: 1,
              color: COLORS.text,
              letterSpacing: "0.04em",
            }}
          >
            PAR SAAL BHAR MEIN
          </div>

          <div style={{position: "relative", display: "inline-block"}}>
            {/* Amber highlighter swipe behind 37 GUNA */}
            <div
              style={{
                position: "absolute",
                left: -20,
                bottom: 20,
                width: `${gunaHighlight}%`,
                height: 100,
                backgroundColor: COLORS.amber,
                opacity: 0.85,
                borderRadius: 8,
                zIndex: 0,
              }}
            />
            <span
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: FONTS.headline,
                fontSize: 300,
                lineHeight: 1,
                color: COLORS.green,
                letterSpacing: "0.02em",
              }}
            >
              37 GUNA
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
