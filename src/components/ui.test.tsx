import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

describe("Button", () => {
  it("renders as a button by default and as a slot when asChild", () => {
    const { rerender } = render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute(
      "data-variant",
      "default"
    );

    rerender(
      <Button variant="outline" size="sm">
        Outline
      </Button>
    );
    expect(screen.getByRole("button", { name: "Outline" })).toHaveAttribute(
      "data-variant",
      "outline"
    );

    rerender(
      <Button asChild variant="ghost" size="lg">
        <a href="/x">Link</a>
      </Button>
    );
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute(
      "href",
      "/x"
    );
  });

  it("covers remaining variants and sizes", () => {
    render(
      <>
        <Button variant="destructive" size="xs">
          D
        </Button>
        <Button variant="secondary" size="icon">
          I
        </Button>
        <Button variant="link" size="icon-xs">
          L
        </Button>
        <Button size="icon-sm">S</Button>
        <Button size="icon-lg">G</Button>
      </>
    );
    expect(buttonVariants({ variant: "default", size: "default" })).toContain(
      "bg-primary"
    );
  });
});

describe("Badge", () => {
  it("renders as a span and as a slot", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toHaveAttribute("data-slot", "badge");

    render(
      <Badge asChild variant="outline">
        <a href="/t">Topic</a>
      </Badge>
    );
    expect(screen.getByRole("link", { name: "Topic" })).toHaveAttribute(
      "href",
      "/t"
    );
  });

  it("covers remaining variants", () => {
    render(
      <>
        <Badge variant="secondary">S</Badge>
        <Badge variant="destructive">D</Badge>
        <Badge variant="ghost">G</Badge>
        <Badge variant="link">L</Badge>
      </>
    );
    expect(badgeVariants({ variant: "default" })).toContain("bg-primary");
  });
});

describe("Input", () => {
  it("forwards type and className", () => {
    render(<Input type="search" className="extra" aria-label="q" />);
    const input = screen.getByRole("searchbox", { name: "q" });
    expect(input).toHaveClass("extra");
  });

  it("defaults to a text input", () => {
    render(<Input aria-label="name" />);
    expect(screen.getByRole("textbox", { name: "name" })).toBeInTheDocument();
  });
});

describe("Separator", () => {
  it("renders horizontal decorative by default and vertical when asked", () => {
    const { rerender } = render(<Separator data-testid="sep" />);
    expect(screen.getByTestId("sep")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    );
    rerender(
      <Separator orientation="vertical" decorative={false} data-testid="sep" />
    );
    expect(screen.getByTestId("sep")).toHaveAttribute(
      "data-orientation",
      "vertical"
    );
  });
});
