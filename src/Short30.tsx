import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

// PLACEHOLDER. It only proves that the render pipeline works end to end.
// The coding agent replaces everything below with the real video (see briefs/).
export const Short30 = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const seconds = Math.floor(frame / fps);
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0E17",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{opacity: fadeIn, color: "#1FE08F", fontSize: 130, fontWeight: 800}}>
        PIPELINE OK
      </div>
      <div style={{color: "#F4F6FA", fontSize: 70, marginTop: 40}}>
        {seconds}s / 30s
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom: 360,
          height: 18,
          borderRadius: 9,
          backgroundColor: "#1E2A3D",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: 9,
            backgroundColor: "#1FE08F",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
