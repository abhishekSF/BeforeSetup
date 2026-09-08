import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { GlobalSearch } from "./global-search";

it("opens by keyboard, searches, closes on navigation, and restores focus", async () => {
  const user = userEvent.setup();
  const view = render(<GlobalSearch />);
  fireEvent.keyDown(document, { key: "k" });
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.keyDown(document, { key: "x", ctrlKey: true });
  fireEvent.keyDown(document, { key: "k", ctrlKey: true });
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  await user.type(screen.getByLabelText("Search the field guide"), "zzzzz");
  expect(screen.getByRole("status")).toHaveTextContent("0 topics");
  await user.clear(screen.getByLabelText("Search the field guide"));
  await user.type(screen.getByLabelText("Search the field guide"), "flow");
  const link = screen.getByRole("link", { name: /^Flow / });
  expect(link).toHaveAttribute("href", "/topics/flow");
  await user.click(link);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.keyDown(document, { key: "K", metaKey: true });
  await user.click(screen.getByRole("button", { name: "Close search" }));
  view.unmount();
});
