import { test } from "node:test";
import assert from "node:assert/strict";
import { checkLink } from "./resource-http.mjs";
for (const [code, expected] of [[200, "healthy"], [204, "healthy"], [404, "broken"], [410, "broken"], [403, "unable-to-verify"], [429, "unable-to-verify"], [503, "unable-to-verify"]]) {
  test(`HTTP ${code}: ${expected}`, async () => {
    const result = await checkLink("https://example.com", async () => new Response(null, { status: code }));
    assert.equal(result.status, expected);
  });
}
test("redirects report the canonical destination", async () => {
  const result = await checkLink("https://example.com", async () => ({ ok: true, redirected: true, status: 200, url: "https://example.com/new", body: { cancel: async () => {} } }));
  assert.equal(result.status, "redirect"); assert.equal(result.canonical, "https://example.com/new");
});
test("timeouts remain warnings", async () => {
  const result = await checkLink("https://example.com", async () => { throw new Error("timeout"); });
  assert.equal(result.status, "unable-to-verify");
});
