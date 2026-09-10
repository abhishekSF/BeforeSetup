import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TopicCard } from "@/components/topic-card";
import { makeTopic } from "@/test/fixtures";

describe("SiteHeader", () => {
  it("renders brand and nav links", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: /BeforeSetup/ })).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getAllByRole("link", { name: "Decisions" })[0]).toHaveAttribute(
      "href",
      "/versus"
    );
    expect(screen.getAllByRole("link", { name: "Atlas" })[0]).toHaveAttribute(
      "href",
      "/map"
    );
    expect(screen.getAllByRole("link", { name: "Topics" })[0]).toHaveAttribute(
      "href",
      "/topics"
    );
    expect(screen.getAllByRole("link", { name: "Paths" })[0]).toHaveAttribute(
      "href",
      "/start"
    );
  });
});

describe("SiteFooter", () => {
  it("includes the independent-guide disclaimer", () => {
    render(<SiteFooter />);
    expect(screen.getByText(/not affiliated with/i)).toBeInTheDocument();
  });
});

describe("TopicCard", () => {
  it("links to the topic and shows its category", () => {
    render(
      <TopicCard
        topic={makeTopic({
          slug: "flow",
          title: "Flow",
          tagline: "Clicks",
          category: "automation",
        })}
      />
    );
    expect(screen.getByRole("link", { name: /Flow/ })).toHaveAttribute(
      "href",
      "/topics/flow"
    );
    expect(screen.getByText("Automation")).toBeInTheDocument();
    expect(screen.getByText("Clicks")).toBeInTheDocument();
  });
});
