import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, FONTS} from "../theme";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // 90–99: Uncover transition from diagonal green wipe
  // At frame 90 wipe covers whole screen, uncovers by frame 99
  const uncoverProgress = interpolate(frame, [0, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 96–110: "DO RAASTE." drops in at top (y about 360, Bebas 170 px, white)
  // (relative frame 6 to 20)
  const titleSpring = spring({
    frame: frame - 6,
    fps,
    config: {damping: 14, mass: 1, stiffness: 180},
  });
  const titleY = interpolate(titleSpring, [0, 1], [200, 360]);
  const titleOpacity = interpolate(frame, [6, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Title fades out over 100-115 (absolute 190-205)
  const titleFadeOut = interpolate(frame, [100, 115], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 112–135: green card slides in from left (translateX -1100 to 0, spring)
  // relative frames: 22 to 45
  const greenCardSpring = spring({
    frame: frame - 22,
    fps,
    config: {damping: 14, mass: 1.1, stiffness: 160},
  });
  const greenCardX = interpolate(greenCardSpring, [0, 1], [-1100, 0]);

  // 135–158: red card slides in from right (translateX 1100 to 0, spring)
  // relative frames: 45 to 68
  const redCardSpring = spring({
    frame: frame - 45,
    fps,
    config: {damping: 14, mass: 1.1, stiffness: 160},
  });
  const redCardX = interpolate(redCardSpring, [0, 1], [1100, 0]);

  // 150–165: white circle badge (120 px) with "VS" (Bebas 70, dark text) pops between cards at y about 950 (spring scale 0 to 1)
  // relative frames: 60 to 75
  const vsSpring = spring({
    frame: frame - 60,
    fps,
    config: {damping: 12, mass: 0.8, stiffness: 220},
  });
  const vsScale = interpolate(vsSpring, [0, 1], [0, 1]);

  // 190–205: both cards slide out (green to left, red to right), title fades out
  // relative frames: 100 to 115
  const exitSlide = interpolate(frame, [100, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const greenExitX = interpolate(exitSlide, [0, 1], [0, -1150]);
  const redExitX = interpolate(exitSlide, [0, 1], [0, 1150]);
  const vsExitScale = interpolate(exitSlide, [0, 1], [1, 0]);

  // Arrow drawing animation:
  // Green arrow draws itself over relative frames 26 to 45
  const greenArrowProgress = interpolate(frame, [26, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Red arrow draws itself over relative frames 49 to 68
  const redArrowProgress = interpolate(frame, [49, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {/* "DO RAASTE." title */}
      <div
        style={{
          position: "absolute",
          top: titleY,
          left: 0,
          width: 1080,
          textAlign: "center",
          fontFamily: FONTS.headline,
          fontSize: 170,
          lineHeight: 1,
          color: COLORS.text,
          opacity: titleOpacity * titleFadeOut,
        }}
      >
        DO RAASTE.
      </div>

      {/* Green Card: 920x340 at y 560–900, 4px green border, green at 12% opacity fill, radius 40 */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 80,
          width: 920,
          height: 340,
          borderRadius: 40,
          border: `4px solid ${COLORS.green}`,
          backgroundColor: "rgba(31, 224, 143, 0.12)",
          transform: `translateX(${greenCardX + greenExitX}px)`,
          boxSizing: "border-box",
          padding: "36px 48px",
          display: "flex",
          alignItems: "center",
          gap: 36,
        }}
      >
        {/* Animated Up-Arrow Icon */}
        <svg width="80" height="110" viewBox="0 0 80 110">
          <path
            d="M 40 100 L 40 18 M 16 42 L 40 18 L 64 42"
            fill="none"
            stroke={COLORS.green}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={200}
            strokeDashoffset={200 * (1 - greenArrowProgress)}
          />
        </svg>

        <div style={{display: "flex", flexDirection: "column", gap: 12}}>
          <div
            style={{
              fontFamily: FONTS.headline,
              fontSize: 130,
              lineHeight: 1,
              color: COLORS.green,
            }}
          >
            ROZ 1% BEHTAR
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              fontSize: 44,
              color: COLORS.muted,
              letterSpacing: "0.02em",
            }}
          >
            1.01 × 1.01 × 1.01 …
          </div>
        </div>
      </div>

      {/* Red Card: y 1000–1340, 920x340 */}
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 80,
          width: 920,
          height: 340,
          borderRadius: 40,
          border: `4px solid ${COLORS.red}`,
          backgroundColor: "rgba(255, 74, 90, 0.12)",
          transform: `translateX(${redCardX + redExitX}px)`,
          boxSizing: "border-box",
          padding: "36px 48px",
          display: "flex",
          alignItems: "center",
          gap: 36,
        }}
      >
        {/* Animated Down-Arrow Icon */}
        <svg width="80" height="110" viewBox="0 0 80 110">
          <path
            d="M 40 10 L 40 92 M 16 68 L 40 92 L 64 68"
            fill="none"
            stroke={COLORS.red}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={200}
            strokeDashoffset={200 * (1 - redArrowProgress)}
          />
        </svg>

        <div style={{display: "flex", flexDirection: "column", gap: 12}}>
          <div
            style={{
              fontFamily: FONTS.headline,
              fontSize: 130,
              lineHeight: 1,
              color: COLORS.red,
            }}
          >
            ROZ 1% KHARAB
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
              fontSize: 44,
              color: COLORS.muted,
              letterSpacing: "0.02em",
            }}
          >
            0.99 × 0.99 × 0.99 …
          </div>
        </div>
      </div>

      {/* VS Badge: white circle (120 px) with "VS" (Bebas 70, dark text) at y about 950 */}
      {frame >= 60 && (
        <div
          style={{
            position: "absolute",
            top: 950 - 60,
            left: 540 - 60,
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: COLORS.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${vsScale * vsExitScale})`,
            transformOrigin: "center center",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.headline,
              fontSize: 70,
              color: COLORS.bg,
              lineHeight: 1,
              marginTop: 4,
            }}
          >
            VS
          </span>
        </div>
      )}

      {/* 90–99 Uncover transition mask */}
      {frame < 10 && (
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
              -200,${-300 + uncoverProgress * 2600}
              1280,${-300 + uncoverProgress * 2600 - 600}
              1280,2220
              -200,2220
            `}
            fill={COLORS.green}
          />
        </svg>
      )}
    </AbsoluteFill>
  );
};
