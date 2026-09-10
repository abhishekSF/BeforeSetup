import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { TopicSchema } from "./topic-schema";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { makeTopic } from "@/test/fixtures";
import { topics } from "@/data/topics";
import { paths } from "@/data/paths";
import { versusPages } from "@/data/versus";

it("includes every route and source review dates in the sitemap", () => {
  const entries = sitemap();
  expect(entries).toHaveLength(5 + topics.length + paths.length + versusPages.length);
  expect(entries.find((entry) => entry.url.endsWith("/topics/apex"))?.lastModified).toBe("2026-09-09");
  expect(robots().sitemap).toContain("/sitemap.xml");
});
it("serializes article and breadcrumb metadata without script injection", () => {
  const { container } = render(<TopicSchema topic={makeTopic({ slug: "test", title: "</script>" })} />);
  const text = container.querySelector("script")!.textContent!;
  expect(text).not.toContain("</script>");
  expect(JSON.parse(text)["@graph"][0].headline).toBe("</script>");
  expect(JSON.parse(text)["@graph"][1].itemListElement).toHaveLength(3);
});
