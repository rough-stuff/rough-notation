import { Rect, RoughAnnotationConfig, RoughAnnotation, SVG_NS } from './model.js';
import { renderAnnotation } from './render.js';
import { ensureKeyframes } from './keyframes.js';

type AnootationState = 'unattached' | 'not-showing' | 'showing';

class RoughAnnotationImpl implements RoughAnnotation {
  private _state: AnootationState = 'unattached';
  private _config: RoughAnnotationConfig;
  private _e: HTMLElement;
  private _svg?: SVGSVGElement;
  private _resizing = false;
  private _resizeObserver?: any; // ResizeObserver is not supported in typescript std lib yet
  private _lastSize?: Rect;

  constructor(e: HTMLElement, config: RoughAnnotationConfig) {
    this._e = e;
    this._config = config;
    this.attach();
  }

  private _resizeListener = () => {
    if (!this._resizing) {
      this._resizing = true;
      setTimeout(() => {
        this._resizing = false;
        if (this._state === 'showing') {
          const newSize = this.computeSize();
          if (newSize && this.hasRectChanged(newSize)) {
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
      const style = svg.style;
      style.position = 'absolute';
      style.top = '0';
      style.left = '0';
      style.overflow = 'visible';
      style.pointerEvents = 'none';
      style.width = '1px';
      style.height = '1px';
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
    if (this._resizeObserver) {
      this._resizeObserver.unobserve(this._e);
    }
  }

  private attachListeners() {
    this.detachListeners();
    window.addEventListener('resize', this._resizeListener, { passive: true });
    if ((!this._resizeObserver) && ('ResizeObserver' in window)) {
      this._resizeObserver = new (window as any).ResizeObserver((entries: any) => {
        for (const entry of entries) {
          let trigger = true;
          if (entry.contentRect) {
            const newRect = this.computeSizeWithBounds(entry.contentRect);
            if (newRect && (!this.hasRectChanged(newRect))) {
              trigger = false;
            }
          }
          if (trigger) {
            this._resizeListener();
          }
        }
      });
    }
    if (this._resizeObserver) {
      this._resizeObserver.observe(this._e);
    }
  }

  private sameInteger(a: number, b: number): boolean {
    return Math.round(a) === Math.round(b);
  }

  private hasRectChanged(rect: Rect): boolean {
    if (this._lastSize && rect) {
      return !(
        this.sameInteger(rect.x, this._lastSize.x) &&
        this.sameInteger(rect.y, this._lastSize.y) &&
        this.sameInteger(rect.w, this._lastSize.w) &&
        this.sameInteger(rect.h, this._lastSize.h)
      );
    }
    return true;
  }

  isShowing(): boolean {
    return (this._state !== 'not-showing');
  }

  show(): void {
    switch (this._state) {
      case 'unattached':
        break;
      case 'showing':
        this.hide();
        this.show();
        break;
      case 'not-showing':
        this.attach();
        if (this._svg) {
          this.render(this._svg);
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

  private render(svg: SVGSVGElement) {
    const rect = this.computeSize();
    if (rect) {
      renderAnnotation(svg, rect, this._config);
      this._lastSize = rect;
      this._state = 'showing';
    }
  }

  private computeSize(): Rect | null {
    return this.computeSizeWithBounds(this._e.getBoundingClientRect());
  }

  private computeSizeWithBounds(bounds: DOMRect | DOMRectReadOnly): Rect | null {
    if (this._svg) {
      const rect1 = this._svg.getBoundingClientRect();
      const rect2 = bounds;

      const x = (rect2.x || rect2.left) - (rect1.x || rect1.left);
      const y = (rect2.y || rect2.top) - (rect1.y || rect1.top);
      const w = rect2.width;
      const h = rect2.height;

      return { x, y, w, h };
    }
    return null;
  }
}

export function annotate(element: HTMLElement, config: RoughAnnotationConfig): RoughAnnotation {
  return new RoughAnnotationImpl(element, config);
}