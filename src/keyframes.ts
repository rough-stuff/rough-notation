export function ensureKeyframes() {
  if (!(window as any).__rough_notation_keyframe_styles) {
    const style = (window as any).__rough_notation_keyframe_styles = document.createElement('style');
    style.textContent = `@keyframes rough-notation-dash { to { stroke-dashoffset: 0; } }`;
    document.head.appendChild(style);
  }
}