import {loadFont as loadBebas} from "@remotion/google-fonts/BebasNeue";
import {loadFont as loadInter} from "@remotion/google-fonts/Inter";

export const bebasFont = loadBebas();
export const interFont = loadInter("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
});

export const COLORS = {
  bg: "#0A0E17",
  panel: "#111827",
  grid: "#1E2A3D",
  text: "#F4F6FA",
  muted: "#8B97AD",
  green: "#1FE08F",
  red: "#FF4A5A",
  amber: "#FFC83D",
  topHalf: "#0F2A20",
  bottomHalf: "#2A0F14",
} as const;

export const FONTS = {
  headline: bebasFont.fontFamily,
  body: interFont.fontFamily,
};
