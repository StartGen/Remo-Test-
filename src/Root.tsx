import {Composition} from "remotion";
import {Short30} from "./Short30";

// The GitHub Action renders the composition with this exact id.
// Keep id="Short30", 1080x1920 (vertical), 30 fps, 900 frames (= 30 seconds).
export const RemotionRoot = () => {
  return (
    <Composition
      id="Short30"
      component={Short30}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
