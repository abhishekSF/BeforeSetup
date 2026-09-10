import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { MobileNavigation } from "./mobile-navigation";

it("closes after choosing a destination and returns focus on Escape", async () => {
  const user = userEvent.setup();
  render(<MobileNavigation><a href="#topics"><span>Topics</span></a></MobileNavigation>);
  const summary = screen.getByLabelText("Open navigation");
  const details = summary.closest("details")!;
  await user.click(summary);
  expect(details.open).toBe(true);
  await user.click(screen.getByRole("navigation"));
  expect(details.open).toBe(true);
  await user.click(screen.getByText("Topics"));
  expect(details.open).toBe(false);
  await user.click(summary);
  await user.tab();
  expect(screen.getByRole("link", { name: "Topics" })).toHaveFocus();
  await user.keyboard("{Escape}");
  expect(details.open).toBe(false);
  expect(summary).toHaveFocus();
});
