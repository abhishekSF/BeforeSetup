import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TopicBrowser } from "@/components/topic-browser";

function categoryChip(id: string) {
  const group = screen.getByRole("group", { name: "Filter by area" });
  const chip = group.querySelector(`[data-category="${id}"]`);
  if (chip === null) {
    throw new Error(`missing category chip ${id}`);
  }
  return chip;
}

describe("TopicBrowser", () => {
  it("filters by search and category, then clears", async () => {
    const user = userEvent.setup();
    render(<TopicBrowser />);

    expect(screen.getByText(/All \(/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Flow" })).toBeInTheDocument();

    fireEvent.click(categoryChip("ai"));
    expect(
      screen.getByRole("heading", { name: /Agentforce/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Flow" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/All \(/));
    expect(screen.getByRole("heading", { name: "Flow" })).toBeInTheDocument();

    fireEvent.click(categoryChip("ai"));
    expect(
      screen.queryByRole("heading", { name: "Flow" })
    ).not.toBeInTheDocument();

    fireEvent.click(categoryChip("ai"));
    expect(screen.getByRole("heading", { name: "Flow" })).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search topics"), "zzzz-no-match");
    expect(screen.getByText("No topics match that search")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("heading", { name: "Flow" })).toBeInTheDocument();
    expect(screen.getByLabelText("Search topics")).toHaveValue("");
  });

  it("matches a real search term", async () => {
    const user = userEvent.setup();
    render(<TopicBrowser />);
    await user.type(screen.getByLabelText("Search topics"), "governor");
    expect(
      screen.getByRole("heading", { name: "Governor Limits" })
    ).toBeInTheDocument();
  });
});
