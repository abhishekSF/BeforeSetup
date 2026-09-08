/** Transport health only. A 200 response can still be a login page or soft 404. */
export async function checkLink(url, request = fetch) {
  try {
    const response = await request(url, {
      redirect: "follow", signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "BeforeSetup-resource-check/1.0 (+https://github.com/abhishekSF/BeforeSetup)" },
    });
    await response.body?.cancel();
    let status = "unable-to-verify";
    if (response.ok) status = response.redirected ? "redirect" : "healthy";
    if (response.status === 404 || response.status === 410) status = "broken";
    return { url, status, code: response.status, canonical: response.url };
  } catch {
    return { url, status: "unable-to-verify", code: 0, canonical: url };
  }
}
