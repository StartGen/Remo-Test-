import React from "react";
import {AbsoluteFill, Sequence} from "remotion";
import {Background} from "./Background";
import {Scene1} from "./scenes/Scene1";
import {Scene2} from "./scenes/Scene2";
import {Scene3} from "./scenes/Scene3";
import {Scene4} from "./scenes/Scene4";
import {Scene5} from "./scenes/Scene5";
import {Scene6} from "./scenes/Scene6";

// Total length is exactly 900 frames (30 seconds at 30 fps)
// Scene 1: frames 0–89 (duration 90)
// Scene 2: frames 90–209 (duration 120)
// Scene 3: frames 210–569 (duration 360)
// Scene 4: frames 570–749 (duration 180)
// Scene 5: frames 750–839 (duration 90)
// Scene 6: frames 840–899 (duration 60)
// 90 + 120 + 360 + 180 + 90 + 60 = 900 frames exactly.
export const Short30: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0E17",
        overflow: "hidden",
      }}
    >
      {/* Persistent background across all 900 frames */}
      <Background />

      {/* Scene 1: Hook */}
      <Sequence from={0} durationInFrames={90}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: Two paths */}
      <Sequence from={90} durationInFrames={120}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: The race chart */}
      <Sequence from={210} durationInFrames={360}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: Reveal */}
      <Sequence from={570} durationInFrames={180}>
        <Scene4 />
      </Sequence>

      {/* Scene 5: The lesson */}
      <Sequence from={750} durationInFrames={90}>
        <Scene5 />
      </Sequence>

      {/* Scene 6: Call to action and loop */}
      <Sequence from={840} durationInFrames={60}>
        <Scene6 />
      </Sequence>
    </AbsoluteFill>
  );
};
