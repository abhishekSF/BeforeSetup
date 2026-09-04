const FALLBACK_SITE_URL = "http://localhost:4780";

export function siteUrl(value: string | undefined): string {
  if (value === undefined) {
    return FALLBACK_SITE_URL;
  }
  if (value.length === 0) {
    return FALLBACK_SITE_URL;
  }
  return value;
}
