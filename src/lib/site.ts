const FALLBACK_DEV_URL = "http://localhost:4780";

/** Canonical URL of the GitHub Pages deployment. */
export const CANONICAL_SITE_URL = "https://abhisheksf.github.io/BeforeSetup";

const STATIC_ROUTES = ["/", "/map", "/topics", "/versus", "/start"] as const;

export function siteUrl(
  value: string | undefined,
  nodeEnv: string | undefined = process.env.NODE_ENV
): string {
  if (value !== undefined && value.length > 0) {
    return value;
  }
  if (nodeEnv === "production") {
    return CANONICAL_SITE_URL;
  }
  return FALLBACK_DEV_URL;
}

/** Join an origin and a path without producing a double slash. */
export function joinSitePath(origin: string, path: string): string {
  const base = origin.endsWith("/") ? origin.slice(0, -1) : origin;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function sitemapUrls(
  origin: string,
  topicSlugs: readonly string[],
  versusSlugs: readonly string[],
  pathSlugs: readonly string[]
): string[] {
  const urls: string[] = [];
  for (const route of STATIC_ROUTES) {
    urls.push(joinSitePath(origin, route));
  }
  for (const slug of topicSlugs) {
    urls.push(joinSitePath(origin, `/topics/${slug}`));
  }
  for (const slug of versusSlugs) {
    urls.push(joinSitePath(origin, `/versus/${slug}`));
  }
  for (const slug of pathSlugs) {
    urls.push(joinSitePath(origin, `/start/${slug}`));
  }
  return urls;
}
