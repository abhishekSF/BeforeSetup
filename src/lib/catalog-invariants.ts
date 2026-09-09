/** YYYY-MM-DD that is a real UTC calendar date, not 2026-02-30. */
export function isIsoDate(value: string): boolean {
  const parsed = Date.parse(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed)) {
    return false;
  }
  return new Date(parsed).toISOString().slice(0, 10) === value;
}

/** Null when `url` is a usable https URL; otherwise a short reason. */
export function httpsUrlError(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "unparseable";
  }
  if (parsed.protocol !== "https:") {
    return "not-https";
  }
  return null;
}

/** First occurrence of each repeated value, in encounter order. */
export function duplicateValues(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      continue;
    }
    if (!dupes.includes(value)) {
      dupes.push(value);
    }
  }
  return dupes;
}

export function isSalesforceDocsHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "salesforce.com") {
    return true;
  }
  return host.endsWith(".salesforce.com");
}

export function hasLongDash(value: string): boolean {
  return value.includes("\u2014") || value.includes("\u2013");
}

export function hasSalesforceDocsResource(
  resources: readonly { url: string }[]
): boolean {
  for (const resource of resources) {
    if (httpsUrlError(resource.url) !== null) {
      continue;
    }
    if (isSalesforceDocsHost(new URL(resource.url).hostname)) {
      return true;
    }
  }
  return false;
}
