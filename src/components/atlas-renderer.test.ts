import { beforeEach, expect, it, vi } from "vitest";
import { intersections, resizes } from "@/test/observers";
import { mountAtlasDepth } from "./atlas-renderer";

const state = vi.hoisted(() => ({ fail: false, loops: [] as (((time: number) => void) | null)[], render: vi.fn(), dispose: vi.fn(), ratio: vi.fn(), size: vi.fn() }));
vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal<typeof import("three")>();
  return { ...actual, WebGLRenderer: class {
    domElement = document.createElement("canvas");
    constructor() { if (state.fail) throw new Error("No GPU"); }
    setPixelRatio = state.ratio;
    setSize = state.size;
    render = state.render;
    dispose = state.dispose;
    setAnimationLoop(callback: ((time: number) => void) | null) { state.loops.push(callback); }
  } };
});
let motion: EventTarget & { matches: boolean };
beforeEach(() => {
  state.fail = false; state.loops.length = 0;
  vi.clearAllMocks();
  motion = Object.assign(new EventTarget(), { matches: false });
  vi.stubGlobal("matchMedia", () => motion);
  Object.defineProperty(document, "hidden", { value: false, configurable: true });
});
it("caps pixel ratio, animates only when visible, and disposes its resources", () => {
  vi.stubGlobal("devicePixelRatio", 3);
  const host = document.createElement("div");
  Object.defineProperties(host, { clientWidth: { value: 800 }, clientHeight: { value: 400 } });
  const dispose = mountAtlasDepth(host);
  expect(state.ratio).toHaveBeenCalledWith(1.5);
  resizes.at(-1)!();
  expect(state.size).toHaveBeenCalledWith(800, 400);
  intersections.at(-1)!([{ isIntersecting: true }]);
  const animation = state.loops.at(-1)!;
  expect(animation).toBeTypeOf("function");
  animation(1000);
  expect(state.render).toHaveBeenCalled();
  motion.matches = true; motion.dispatchEvent(new Event("change"));
  expect(state.loops.at(-1)).toBeNull();
  motion.matches = false; motion.dispatchEvent(new Event("change"));
  Object.defineProperty(document, "hidden", { value: true, configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
  expect(state.loops.at(-1)).toBeNull();
  intersections.at(-1)!([{ isIntersecting: false }]);
  const lost = new Event("webglcontextlost", { cancelable: true });
  host.querySelector("canvas")!.dispatchEvent(lost);
  expect(lost.defaultPrevented).toBe(true);
  expect(host.dataset.renderer).toBe("unavailable");
  dispose();
  expect(host.children).toHaveLength(0); expect(state.dispose).toHaveBeenCalledOnce();
});
it("renders a static reduced-motion field and tolerates zero-size containers", () => {
  motion.matches = true;
  vi.stubGlobal("devicePixelRatio", 1);
  const dispose = mountAtlasDepth(document.createElement("div"));
  resizes.at(-1)!(); intersections.at(-1)!([{ isIntersecting: true }]);
  expect(state.ratio).toHaveBeenCalledWith(1);
  expect(state.size).toHaveBeenCalledWith(1, 1);
  expect(state.loops.at(-1)).toBeNull(); dispose();
});
it("falls back without WebGL", () => {
  state.fail = true;
  const host = document.createElement("div");
  mountAtlasDepth(host)();
  expect(host.dataset.renderer).toBe("unavailable");
});

it("does not render or restart after context loss", () => {
  const host = document.createElement("div");
  const dispose = mountAtlasDepth(host);
  Object.defineProperty(document, "hidden", { value: false, configurable: true });
  intersections.at(-1)!([{ isIntersecting: true }]);
  const animation = state.loops.at(-1)!;
  const rendersBeforeLoss = state.render.mock.calls.length;
  const sizesBeforeLoss = state.size.mock.calls.length;
  const lost = new Event("webglcontextlost", { cancelable: true });
  host.querySelector("canvas")!.dispatchEvent(lost);
  const loopCountAtLoss = state.loops.length;

  animation(1000);
  resizes.at(-1)!();
  document.dispatchEvent(new Event("visibilitychange"));
  motion.dispatchEvent(new Event("change"));
  intersections.at(-1)!([{ isIntersecting: true }]);

  expect(state.render).toHaveBeenCalledTimes(rendersBeforeLoss);
  expect(state.size).toHaveBeenCalledTimes(sizesBeforeLoss);
  expect(state.loops.slice(loopCountAtLoss).every((loop) => loop === null)).toBe(true);
  dispose();
  expect(state.dispose).toHaveBeenCalledOnce();
});
