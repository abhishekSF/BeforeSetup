import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TopicMap } from "@/components/topic-map";
import { topics } from "@/data/topics";

describe("TopicMap", () => {
  it("keeps every topic reachable through SVG links and semantic DOM", () => {
    render(<TopicMap />);
    const graph = screen.getByRole("group", { name: /Interactive map/ });
    expect(graph.querySelectorAll("a[href]")).toHaveLength(topics.length);
    expect(screen.getAllByRole("link", { name: "Flow" })).toHaveLength(2);
  });
  it("reveals the same relationships on hover and keyboard focus", async () => {
    const user = userEvent.setup();
    render(<TopicMap />);
    const graph = screen.getByRole("group", { name: /Interactive map/ });
    const flow = within(graph).getByRole("link", { name: "Flow" });
    await user.hover(flow);
    expect(screen.getByText("Open topic →")).toBeInTheDocument();
    await user.unhover(flow);
    expect(screen.getByText(/Hover or focus to trace/)).toBeInTheDocument();
    fireEvent.focus(flow);
    expect(screen.getByText("Open topic →")).toBeInTheDocument();
    expect(flow).toHaveAttribute("href", "/topics/flow");
    fireEvent.blur(flow);
    expect(screen.getByText(/Hover or focus to trace/)).toBeInTheDocument();
  });
  it("searches and isolates category nodes without changing the graph", async () => {
    const user = userEvent.setup();
    render(<TopicMap />);
    await user.click(screen.getByRole("button", { name: "Automation" }));
    expect(screen.getByRole("button", { name: "Automation" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent("5 topics");
    await user.type(screen.getByLabelText("Search the atlas"), "zzzz");
    expect(screen.getByRole("status")).toHaveTextContent("0 topics");
  });
  it("composes a compact preview without duplicate controls", () => {
    render(<TopicMap compact />);
    expect(screen.queryByLabelText("Search the atlas")).not.toBeInTheDocument();
  });
});
