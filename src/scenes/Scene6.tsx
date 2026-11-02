import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {COLORS, FONTS} from "../theme";

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame(); // 0 to 59 (mapped to global 840 to 899)
  const {fps} = useVideoConfig();

  // 840–860 (rel 0–20): "AAJ TERA" / "1% KYA" / "HAI?" stacked (Bebas 200 px), 5 frames apart.
  // "1%" is green.
  // Line 1: AAJ TERA (rel 0)
  const sp1 = spring({
    frame: frame - 0,
    fps,
    config: {damping: 14, mass: 1, stiffness: 200},
  });
  const scale1 = interpolate(sp1, [0, 1], [2.0, 1]);
  const op1 = interpolate(frame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line 2: 1% KYA (rel 5)
  const sp2 = spring({
    frame: frame - 5,
    fps,
    config: {damping: 14, mass: 1, stiffness: 200},
  });
  const scale2 = interpolate(sp2, [0, 1], [2.0, 1]);
  const op2 = interpolate(frame, [5, 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line 3: HAI? (rel 10)
  const sp3 = spring({
    frame: frame - 10,
    fps,
    config: {damping: 14, mass: 1, stiffness: 200},
  });
  const scale3 = interpolate(sp3, [0, 1], [2.0, 1]);
  const op3 = interpolate(frame, [10, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 860–884 (rel 20–44): the green "1%" pulses gently (scale 1 to 1.08 and back)
  // Sin cycle over 24 frames: Math.sin((frame - 20) / 24 * Math.PI)
  const pulseScale =
    frame >= 20 && frame <= 44
      ? 1 + 0.08 * Math.sin(((frame - 20) / 24) * Math.PI)
      : 1;

  // 885–899 (rel 45–59): everything fades out until the last frame equals frame 0
  // (background plus the thin green line at the centre), so the Short loops cleanly.
  // Frame 0 of composition has the thin green line starting at center (width 0 at frame 0).
  const textFadeOut = interpolate(frame, [45, 55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // At frame 59 (composition frame 899), text is completely gone (opacity 0).
  // The background continues seamlessly.

  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 0,
          width: 1080,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          opacity: textFadeOut,
        }}
      >
        {/* AAJ TERA */}
        <div
          style={{
            fontFamily: FONTS.headline,
            fontSize: 200,
            lineHeight: 1,
            color: COLORS.text,
            opacity: op1,
            transform: `scale(${scale1})`,
            transformOrigin: "center center",
          }}
        >
          AAJ TERA
        </div>

        {/* 1% KYA */}
        {frame >= 5 && (
          <div
            style={{
              fontFamily: FONTS.headline,
              fontSize: 200,
              lineHeight: 1,
              color: COLORS.text,
              opacity: op2,
              transform: `scale(${scale2})`,
              transformOrigin: "center center",
              display: "flex",
              gap: 20,
            }}
          >
            <span
              style={{
                color: COLORS.green,
                display: "inline-block",
                transform: `scale(${pulseScale})`,
                transformOrigin: "center center",
              }}
            >
              1%
            </span>
            <span>KYA</span>
          </div>
        )}

        {/* HAI? */}
        {frame >= 10 && (
          <div
            style={{
              fontFamily: FONTS.headline,
              fontSize: 200,
              lineHeight: 1,
              color: COLORS.text,
              opacity: op3,
              transform: `scale(${scale3})`,
              transformOrigin: "center center",
            }}
          >
            HAI?
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
