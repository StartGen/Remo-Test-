import {Easing} from "remotion";

// Chart area coordinates:
// x 90–990 (width 900)
// y 560–1360 (height 800)
// Baseline (0x) at y=1360, top (40x) at y=560, so 20 px per 1x.
export const CHART_BOUNDS = {
  xMin: 90,
  xMax: 990,
  width: 900,
  yMin: 560, // 40x
  yMax: 1360, // 0x
  height: 800,
  baselineY: 1360,
  scaleY: 20, // 20 px per 1x
  totalDays: 365,
};

// Real formulas
export const calcGreen = (day: number): number => {
  return Math.pow(1.01, day);
};

export const calcRed = (day: number): number => {
  return Math.pow(0.99, day);
};

// Map day to X coordinate
export const dayToX = (day: number): number => {
  return CHART_BOUNDS.xMin + (day / CHART_BOUNDS.totalDays) * CHART_BOUNDS.width;
};

// Map multiplier value to Y coordinate
export const valToY = (val: number): number => {
  return CHART_BOUNDS.baselineY - val * CHART_BOUNDS.scaleY;
};

// Ease in out cubic bezier (0.45, 0, 0.55, 1)
export const chartDayEasing = Easing.bezier(0.45, 0, 0.55, 1);
