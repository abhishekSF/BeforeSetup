import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ConnectedTopics,
  EditionNote,
  LifecycleBadge,
  PackagingBadge,
  RelatedDecisions,
  VersusOptions,
} from "@/components/content-bits";
import { PickCell } from "@/components/pick-cell";
import { makeTopic, makeVersus } from "@/test/fixtures";

describe("LifecycleBadge", () => {
  it("renders nothing for GA and a badge otherwise", () => {
    const { container, rerender } = render(<LifecycleBadge lifecycle="ga" />);
    expect(container).toBeEmptyDOMElement();
    rerender(<LifecycleBadge lifecycle="beta" />);
    expect(screen.getByText("beta")).toBeInTheDocument();
  });
});

describe("PackagingBadge", () => {
  it("renders nothing for core and a label otherwise", () => {
    const { container, rerender } = render(<PackagingBadge packaging="core" />);
    expect(container).toBeEmptyDOMElement();
    rerender(<PackagingBadge packaging="add-on" />);
    expect(screen.getByText("Add-on SKU")).toBeInTheDocument();
  });
});

describe("EditionNote", () => {
  it("renders nothing without a note", () => {
    const { container, rerender } = render(<EditionNote note={undefined} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<EditionNote note="Enterprise only" />);
    expect(screen.getByText(/Enterprise only/)).toBeInTheDocument();
  });
});

describe("RelatedDecisions", () => {
  it("renders nothing when empty and links when present", () => {
    const { container, rerender } = render(<RelatedDecisions decisions={[]} />);
    expect(container).toBeEmptyDOMElement();
    rerender(
      <RelatedDecisions
        decisions={[makeVersus({ slug: "a-vs-b", title: "A vs B", question: "Q" })]}
      />
    );
    expect(screen.getByRole("link", { name: /A vs B/ })).toHaveAttribute(
      "href",
      "/versus/a-vs-b"
    );
  });
});

describe("ConnectedTopics", () => {
  it("renders nothing when empty and badges when present", () => {
    const { container, rerender } = render(
      <ConnectedTopics topics={[]} heading="Related" />
    );
    expect(container).toBeEmptyDOMElement();
    rerender(
      <ConnectedTopics
        topics={[makeTopic({ slug: "flow", title: "Flow", category: "automation" })]}
        heading="Related"
      />
    );
    expect(screen.getByText("Related")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Flow" })).toHaveAttribute(
      "href",
      "/topics/flow"
    );
  });
});

describe("VersusOptions", () => {
  it("links options with a topic and spans ones without", () => {
    render(
      <VersusOptions
        options={[{ label: "Wizard" }, { label: "Flow", topic: "flow" }]}
      />
    );
    expect(screen.getByText("Wizard").closest("a")).toBeNull();
    expect(screen.getByRole("link", { name: "Flow" })).toHaveAttribute(
      "href",
      "/topics/flow"
    );
  });
});

describe("PickCell", () => {
  it("shows It depends, a single pick, and multiple picks", () => {
    const { rerender } = render(<PickCell pick={null} />);
    expect(screen.getByText("It depends")).toBeInTheDocument();
    rerender(<PickCell pick="Flow" />);
    expect(screen.getByText("Flow")).toBeInTheDocument();
    rerender(<PickCell pick={["A", "B"]} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
