import { act, render } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { intersections } from "@/test/observers";
import { AtlasDepth } from "./atlas-depth";
import { mountAtlasDepth } from "./atlas-renderer";

vi.mock("./atlas-renderer", () => ({ mountAtlasDepth: vi.fn(() => vi.fn()) }));
it("waits until visible, lazy loads once and cleans up", async () => {
  const view = render(<AtlasDepth />);
  await act(async () => { intersections.at(-1)!([{ isIntersecting: false }]); });
  expect(mountAtlasDepth).not.toHaveBeenCalled();
  await act(async () => { intersections.at(-1)!([{ isIntersecting: true }]); });
  expect(mountAtlasDepth).toHaveBeenCalledOnce();
  const cleanup = vi.mocked(mountAtlasDepth).mock.results[0].value;
  view.unmount(); expect(cleanup).toHaveBeenCalledOnce();
});
it("does not mount a renderer after the component is removed", async () => {
  vi.mocked(mountAtlasDepth).mockClear();
  const view = render(<AtlasDepth />);
  await act(async () => {
    intersections.at(-1)!([{ isIntersecting: true }]); view.unmount();
  });
  expect(mountAtlasDepth).not.toHaveBeenCalled();
});
it("keeps the fallback when loading the renderer fails", async () => {
  vi.mocked(mountAtlasDepth).mockImplementationOnce(() => { throw new Error("Chunk unavailable"); });
  const view = render(<AtlasDepth />);
  await act(async () => { intersections.at(-1)!([{ isIntersecting: true }]); });
  expect(view.container.firstChild).toHaveAttribute("data-renderer", "unavailable");
});
