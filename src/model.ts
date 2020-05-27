export const SVG_NS = 'http://www.w3.org/2000/svg';

export const DEFAULT_ANIMATION_DURATION = 1000;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type RoughAnnotationType = 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off';

export interface RoughAnnotationConfig {
  type: RoughAnnotationType;
  animate?: boolean; // defaults to true
  animationDuration?: number; // defaulst to 1000ms
  animationDelay?: number; // default = 0
  color?: string; // defaults to currentColor
  strokeWidth?: number; // default based on type
  padding?: number; // defaults to 5px
}

export interface RoughAnnotation {
  isShowing(): boolean;
  show(): void;
  hide(): void;
  remove(): void;
}

export interface RoughAnnotationGroup {
  show(): void;
  hide(): void;
}