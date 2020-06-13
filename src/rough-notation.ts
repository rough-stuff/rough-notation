import { Rect, RoughAnnotationConfig, RoughAnnotation, SVG_NS, RoughAnnotationGroup, DEFAULT_ANIMATION_DURATION } from './model.js';
import { renderAnnotation } from './render.js';
import { ensureKeyframes } from './keyframes.js';
import { randomSeed } from 'roughjs/bin/math';

type AnnotationState = 'unattached' | 'not-showing' | 'showing';

class RoughAnnotationImpl implements RoughAnnotation {
  private _state: AnnotationState = 'unattached';
  private _config: RoughAnnotationConfig;
  private _resizing = false;
  private _ro?: any; // ResizeObserver is not supported in typescript std lib yet
  private _seed = randomSeed();

  private _e: HTMLElement;
  private _svg?: SVGSVGElement;
  private _lastSizes: Rect[] = [];

  _animationDelay = 0;

  constructor(e: HTMLElement, config: RoughAnnotationConfig) {
    this._e = e;
    this._config = JSON.parse(JSON.stringify(config));
    this.attach();
  }

  get animate() { return this._config.animate; }
  set animate(value) { this._config.animate = value; }

  get animationDuration() { return this._config.animationDuration; }
  set animationDuration(value) { this._config.animationDuration = value; }

  get iterations() { return this._config.iterations; }
  set iterations(value) { this._config.iterations = value; }

  get color() { return this._config.color; }
  set color(value) {
    if (this._config.color !== value) {
      this._config.color = value;
      this.refresh();
    }
  }

  get strokeWidth() { return this._config.strokeWidth; }
  set strokeWidth(value) {
    if (this._config.strokeWidth !== value) {
      this._config.strokeWidth = value;
      this.refresh();
    }
  }

  get padding() { return this._config.padding; }
  set padding(value) {
    if (this._config.padding !== value) {
      this._config.padding = value;
      this.refresh();
    }
  }

  private _resizeListener = () => {
    if (!this._resizing) {
      this._resizing = true;
      setTimeout(() => {
        this._resizing = false;
        if (this._state === 'showing') {
          if (this.haveRectsChanged()) {
            this.show();
          }
        }
      }, 400);
    }
  }

  private attach() {
    if (this._state === 'unattached' && this._e.parentElement) {
      ensureKeyframes();
      const svg = this._svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('class', 'rough-annotation');
      const style = svg.style;
      style.position = 'absolute';
      style.top = '0';
      style.left = '0';
      style.overflow = 'visible';
      style.pointerEvents = 'none';
      style.width = '100px';
      style.height = '100px';
      const prepend = this._config.type === 'highlight';
      this._e.insertAdjacentElement(prepend ? 'beforebegin' : 'afterend', svg);
      this._state = 'not-showing';

      // ensure e is positioned
      if (prepend) {
        const computedPos = window.getComputedStyle(this._e).position;
        const unpositioned = (!computedPos) || (computedPos === 'static');
        if (unpositioned) {
          this._e.style.position = 'relative';
        }
      }
      this.attachListeners();
    }
  }

  private detachListeners() {
    window.removeEventListener('resize', this._resizeListener);
    if (this._ro) {
      this._ro.unobserve(this._e);
    }
  }

  private attachListeners() {
    this.detachListeners();
    window.addEventListener('resize', this._resizeListener, { passive: true });
    if ((!this._ro) && ('ResizeObserver' in window)) {
      this._ro = new (window as any).ResizeObserver((entries: any) => {
        for (const entry of entries) {
          if (entry.contentRect) {
            this._resizeListener();
          }
        }
      });
    }
    if (this._ro) {
      this._ro.observe(this._e);
    }
  }

  private haveRectsChanged(): boolean {
    if (this._lastSizes.length) {
      const newRects = this.rects();
      if (newRects.length === this._lastSizes.length) {
        for (let i = 0; i < newRects.length; i++) {
          if (!this.isSameRect(newRects[i], this._lastSizes[i])) {
            return true;
          }
        }
      } else {
        return true;
      }
    }
    return false;
  }

  private isSameRect(rect1: Rect, rect2: Rect): boolean {
    const si = (a: number, b: number) => Math.round(a) === Math.round(b);
    return (
      si(rect1.x, rect2.x) &&
      si(rect1.y, rect2.y) &&
      si(rect1.w, rect2.w) &&
      si(rect1.h, rect2.h)
    );
  }

  isShowing(): boolean {
    return (this._state !== 'not-showing');
  }

  private pendingRefresh?: Promise<void>;
  private refresh() {
    if (this.isShowing() && (!this.pendingRefresh)) {
      this.pendingRefresh = Promise.resolve().then(() => {
        if (this.isShowing()) {
          this.show();
        }
        delete this.pendingRefresh;
      });
    }
  }

  show(): void {
    switch (this._state) {
      case 'unattached':
        break;
      case 'showing':
        this.hide();
        if (this._svg) {
          this.render(this._svg, true);
        }
        break;
      case 'not-showing':
        this.attach();
        if (this._svg) {
          this.render(this._svg, false);
        }
        break;
    }
  }

  hide(): void {
    if (this._svg) {
      while (this._svg.lastChild) {
        this._svg.removeChild(this._svg.lastChild);
      }
    }
    this._state = 'not-showing';
  }

  remove(): void {
    if (this._svg && this._svg.parentElement) {
      this._svg.parentElement.removeChild(this._svg);
    }
    this._svg = undefined;
    this._state = 'unattached';
    this.detachListeners();
  }

  private render(svg: SVGSVGElement, ensureNoAnimation: boolean) {
    let config = this._config;
    if (ensureNoAnimation) {
      config = JSON.parse(JSON.stringify(this._config));
      config.animate = false;
    }
    const rects = this.rects();
    let totalWidth = 0;
    rects.forEach((rect) => totalWidth += rect.w);
    const totalDuration = (config.animationDuration || DEFAULT_ANIMATION_DURATION);
    let delay = 0;
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      config.animationDuration = totalDuration * (rect.w / totalWidth);
      renderAnnotation(svg, rects[i], config, delay + this._animationDelay, this._seed);
      delay += config.animationDuration;
    }
    this._lastSizes = rects;
    this._state = 'showing';
  }

  private rects(): Rect[] {
    const ret: Rect[] = [];
    if (this._svg) {
      if (this._config.multiline) {
        const elementRects = this._e.getClientRects();
        for (let i = 0; i < elementRects.length; i++) {
          ret.push(this.svgRect(this._svg, elementRects[i]));
        }
      } else {
        ret.push(this.svgRect(this._svg, this._e.getBoundingClientRect()));
      }
    }
    return ret;
  }

  private svgRect(svg: SVGSVGElement, bounds: DOMRect | DOMRectReadOnly): Rect {
    const rect1 = svg.getBoundingClientRect();
    const rect2 = bounds;

    const x = (rect2.x || rect2.left) - (rect1.x || rect1.left);
    const y = (rect2.y || rect2.top) - (rect1.y || rect1.top);
    const w = rect2.width;
    const h = rect2.height;

    return { x, y, w, h };
  }
}

export function annotate(element: HTMLElement, config: RoughAnnotationConfig): RoughAnnotation {
  return new RoughAnnotationImpl(element, config);
}

export function annotationGroup(annotations: RoughAnnotation[]): RoughAnnotationGroup {
  let delay = 0;
  for (const a of annotations) {
    const ai = a as RoughAnnotationImpl;
    ai._animationDelay = delay;
    const duration = ai.animationDuration === 0 ? 0 : (ai.animationDuration || DEFAULT_ANIMATION_DURATION);
    delay += duration;
  }
  const list = [...annotations];
  return {
    show() {
      for (const a of list) {
        a.show();
      }
    },
    hide() {
      for (const a of list) {
        a.hide();
      }
    }
  };
}