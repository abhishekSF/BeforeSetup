import { describe, expect, it } from "vitest";
import {
  duplicateValues,
  hasSalesforceDocsResource,
  httpsUrlError,
  hasLongDash,
  isIsoDate,
  isSalesforceDocsHost,
} from "@/lib/catalog-invariants";

describe("isIsoDate", () => {
  it("accepts real YYYY-MM-DD calendar dates", () => {
    expect(isIsoDate("2026-09-01")).toBe(true);
    expect(isIsoDate("2024-02-29")).toBe(true);
  });

  it("rejects strings that are not a UTC YYYY-MM-DD date", () => {
    expect(isIsoDate("")).toBe(false);
    expect(isIsoDate("2026-9-1")).toBe(false);
    expect(isIsoDate("2026/09/01")).toBe(false);
    expect(isIsoDate("09-01-2026")).toBe(false);
    expect(isIsoDate("x2026-09-01")).toBe(false);
    expect(isIsoDate("2026-09-01x")).toBe(false);
  });

  it("rejects impossible calendar days", () => {
    expect(isIsoDate("2026-02-30")).toBe(false);
    expect(isIsoDate("2026-13-01")).toBe(false);
    expect(isIsoDate("2025-02-29")).toBe(false);
  });
});

describe("httpsUrlError", () => {
  it("accepts https URLs with a host", () => {
    expect(httpsUrlError("https://developer.salesforce.com/docs")).toBeNull();
    expect(httpsUrlError("https://example.com/a?b=1#c")).toBeNull();
  });

  it("rejects unparseable and non-https values", () => {
    expect(httpsUrlError("not a url")).toBe("unparseable");
    expect(httpsUrlError("https://")).toBe("unparseable");
    expect(httpsUrlError("http://example.com/docs")).toBe("not-https");
    expect(httpsUrlError("ftp://example.com/file")).toBe("not-https");
  });
});

describe("duplicateValues", () => {
  it("returns unique duplicates in encounter order", () => {
    expect(duplicateValues([])).toEqual([]);
    expect(duplicateValues(["a", "b"])).toEqual([]);
    expect(duplicateValues(["a", "b", "a", "a", "b"])).toEqual(["a", "b"]);
    expect(duplicateValues(["x", "x", "x"])).toEqual(["x"]);
  });
});

describe("isSalesforceDocsHost", () => {
  it("matches the apex domain and subdomains only", () => {
    expect(isSalesforceDocsHost("salesforce.com")).toBe(true);
    expect(isSalesforceDocsHost("Salesforce.COM")).toBe(true);
    expect(isSalesforceDocsHost("developer.salesforce.com")).toBe(true);
    expect(isSalesforceDocsHost("help.salesforce.com")).toBe(true);
    expect(isSalesforceDocsHost("trailhead.salesforce.com")).toBe(true);
  });

  it("does not treat lookalike community hosts as official", () => {
    expect(isSalesforceDocsHost("salesforceben.com")).toBe(false);
    expect(isSalesforceDocsHost("apexhours.com")).toBe(false);
    expect(isSalesforceDocsHost("notsalesforce.com")).toBe(false);
    expect(isSalesforceDocsHost("salesforce.com.evil.example")).toBe(false);
  });
});

describe("hasLongDash", () => {
  it("detects em dashes and en dashes only", () => {
    expect(hasLongDash("a\u2014b")).toBe(true);
    expect(hasLongDash("a\u2013b")).toBe(true);
    expect(hasLongDash("a-b")).toBe(false);
    expect(hasLongDash("plain")).toBe(false);
    expect(hasLongDash("")).toBe(false);
  });
});

describe("hasSalesforceDocsResource", () => {
  it("is true when any https resource is on a Salesforce host", () => {
    expect(
      hasSalesforceDocsResource([
        { url: "https://www.salesforceben.com/post" },
        { url: "https://help.salesforce.com/s/articleView?id=platform.x.htm" },
      ])
    ).toBe(true);
    expect(
      hasSalesforceDocsResource([{ url: "https://salesforce.com/agentforce/" }])
    ).toBe(true);
  });

  it("is false when the list is empty, invalid, or only third-party", () => {
    expect(hasSalesforceDocsResource([])).toBe(false);
    expect(hasSalesforceDocsResource([{ url: "not-a-url" }])).toBe(false);
    expect(
      hasSalesforceDocsResource([{ url: "https://www.salesforceben.com/post" }])
    ).toBe(false);
  });
});
