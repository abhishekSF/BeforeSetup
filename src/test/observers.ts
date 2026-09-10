import { vi } from "vitest";

export const intersections: ((entries: { isIntersecting: boolean }[]) => void)[] = [];
export const resizes: (() => void)[] = [];
export class TestIntersectionObserver {
  constructor(callback: (entries: { isIntersecting: boolean }[]) => void) { intersections.push(callback); }
  observe = vi.fn();
  disconnect = vi.fn();
}
export class TestResizeObserver {
  constructor(callback: () => void) { resizes.push(callback); }
  observe = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);
vi.stubGlobal("ResizeObserver", TestResizeObserver);
