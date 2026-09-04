import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import { TopicMap } from "@/components/topic-map";
import { routerPush } from "@/test/router-mock";

describe("TopicMap", () => {
  beforeEach(() => {
    routerPush.mockClear();
  });

  it("renders the svg map and the mobile grouped list", () => {
    render(<TopicMap />);
    expect(
      screen.getByRole("img", { name: /Interactive map of Salesforce/ })
    ).toBeInTheDocument();
    expect(screen.getByText("Hover a node to preview · click to dive in")).toBeInTheDocument();
    expect(screen.getAllByText("Flow").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Flow" }).length).toBeGreaterThan(
      0
    );
  });

  it("shows a preview on hover and navigates on click", async () => {
    const user = userEvent.setup();
    render(<TopicMap />);
    const svgs = screen.getAllByRole("img", {
      name: /Interactive map of Salesforce/,
    });
    const svg = svgs[0];
    const nodeGroup = svg.querySelector('g[transform]') as SVGGElement;
    expect(nodeGroup).toBeTruthy();

    await user.hover(nodeGroup);
    expect(screen.getByText("Click to dive in →")).toBeInTheDocument();

    await user.click(nodeGroup);
    expect(routerPush).toHaveBeenCalled();
    const dest = String(routerPush.mock.calls[0]?.[0]);
    expect(dest.startsWith("/topics/")).toBe(true);

    await user.unhover(nodeGroup);
    expect(
      screen.getByText("Hover a node to preview · click to dive in")
    ).toBeInTheDocument();
  });
});
