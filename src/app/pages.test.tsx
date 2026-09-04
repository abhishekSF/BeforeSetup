import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import RootLayout, { metadata as rootMetadata } from "@/app/layout";
import NotFound from "@/app/not-found";
import MapPage, { metadata as mapMetadata } from "@/app/map/page";
import TopicsPage, { metadata as topicsMetadata } from "@/app/topics/page";
import VersusIndexPage, { metadata as versusIndexMetadata } from "@/app/versus/page";
import StartPage, { metadata as startMetadata } from "@/app/start/page";
import TopicPage, {
  generateMetadata as topicMeta,
  generateStaticParams as topicParams,
} from "@/app/topics/[slug]/page";
import VersusPage, {
  generateMetadata as versusMeta,
  generateStaticParams as versusParams,
} from "@/app/versus/[slug]/page";
import PathPage, {
  generateMetadata as pathMeta,
  generateStaticParams as pathParams,
} from "@/app/start/[slug]/page";
import OpengraphImage, {
  alt,
  contentType,
  size,
} from "@/app/opengraph-image";

describe("root layout and static pages", () => {
  it("renders the document shell", () => {
    render(
      <RootLayout>
        <p>child</p>
      </RootLayout>
    );
    expect(screen.getByText("child")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /BeforeSetup/ })).toBeInTheDocument();
    expect(rootMetadata.title).toBeDefined();
  });

  it("renders home, map, topics, versus index, and start", () => {
    const { unmount: unmountHome } = render(<Home />);
    expect(
      screen.getByRole("heading", {
        name: /The five minutes before you touch Setup/,
      })
    ).toBeInTheDocument();
    unmountHome();

    const { unmount: unmountMap } = render(<MapPage />);
    expect(screen.getByRole("heading", { name: "The topic map" })).toBeInTheDocument();
    expect(mapMetadata.title).toBe("Topic map");
    unmountMap();

    const { unmount: unmountTopics } = render(<TopicsPage />);
    expect(screen.getByRole("heading", { name: "All topics" })).toBeInTheDocument();
    expect(topicsMetadata.title).toBe("All topics");
    unmountTopics();

    const { unmount: unmountVersus } = render(<VersusIndexPage />);
    expect(
      screen.getByRole("heading", { name: /The questions people actually ask/ })
    ).toBeInTheDocument();
    expect(versusIndexMetadata.title).toBe("Decisions");
    unmountVersus();

    render(<StartPage />);
    expect(screen.getByRole("heading", { name: "Start here" })).toBeInTheDocument();
    expect(startMetadata.title).toBe("Start here");
  });

  it("renders the not-found page", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: "Off the map" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open the map" })).toHaveAttribute(
      "href",
      "/map"
    );
    expect(
      screen.getByRole("link", { name: "Browse all topics" })
    ).toHaveAttribute("href", "/topics");
  });

  it("builds the opengraph image", () => {
    const image = OpengraphImage();
    expect(image).toBeDefined();
    expect(alt).toContain("BeforeSetup");
    expect(contentType).toBe("image/png");
    expect(size).toEqual({ width: 1200, height: 630 });
  });
});

describe("topic pages", () => {
  it("generateStaticParams lists every topic", () => {
    const params = topicParams();
    expect(params.length).toBeGreaterThan(10);
    expect(params.some((p) => p.slug === "flow")).toBe(true);
  });

  it("generateMetadata handles missing and found topics", async () => {
    await expect(
      topicMeta({ params: Promise.resolve({ slug: "missing" }) })
    ).resolves.toEqual({ title: "Topic not found" });
    const meta = await topicMeta({
      params: Promise.resolve({ slug: "flow" }),
    });
    expect(meta.title).toBe("Flow");
  });

  it("renders a core GA topic", async () => {
    render(await TopicPage({ params: Promise.resolve({ slug: "flow" }) }));
    expect(screen.getByRole("heading", { name: "Flow" })).toBeInTheDocument();
  });

  it("renders a packaged/beta topic", async () => {
    render(
      await TopicPage({ params: Promise.resolve({ slug: "headless-360" }) })
    );
    expect(
      screen.getByRole("heading", { name: /Headless 360/ })
    ).toBeInTheDocument();
    expect(screen.getByText("beta")).toBeInTheDocument();
  });

  it("renders a consumption-priced topic with an edition note", async () => {
    render(
      await TopicPage({ params: Promise.resolve({ slug: "agentforce" }) })
    );
    expect(screen.getByText(/Licensing reality/)).toBeInTheDocument();
    expect(screen.getByText("Consumption-priced")).toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      TopicPage({ params: Promise.resolve({ slug: "nope" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("versus pages", () => {
  it("generateStaticParams lists every decision", () => {
    expect(versusParams().some((p) => p.slug === "flow-vs-apex-trigger")).toBe(
      true
    );
  });

  it("generateMetadata handles missing and found", async () => {
    await expect(
      versusMeta({ params: Promise.resolve({ slug: "missing" }) })
    ).resolves.toEqual({ title: "Decision not found" });
    const meta = await versusMeta({
      params: Promise.resolve({ slug: "flow-vs-apex-trigger" }),
    });
    expect(String(meta.title)).toMatch(/Flow vs Apex/);
  });

  it("renders the matrix including it-depends rows", async () => {
    render(
      await VersusPage({
        params: Promise.resolve({ slug: "flow-vs-apex-trigger" }),
      })
    );
    expect(screen.getByText("It depends")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Flow vs Apex/ })).toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      VersusPage({ params: Promise.resolve({ slug: "nope" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("path pages", () => {
  it("generateStaticParams lists every path", () => {
    expect(pathParams().some((p) => p.slug === "admin")).toBe(true);
  });

  it("generateMetadata handles missing and found", async () => {
    await expect(
      pathMeta({ params: Promise.resolve({ slug: "missing" }) })
    ).resolves.toEqual({ title: "Path not found" });
    const meta = await pathMeta({
      params: Promise.resolve({ slug: "admin" }),
    });
    expect(String(meta.title)).toMatch(/path/);
  });

  it("renders a path with numbered steps", async () => {
    render(await PathPage({ params: Promise.resolve({ slug: "admin" }) }));
    expect(screen.getByRole("heading", { name: /Admin/ })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("calls notFound for an unknown slug", async () => {
    await expect(
      PathPage({ params: Promise.resolve({ slug: "nope" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
