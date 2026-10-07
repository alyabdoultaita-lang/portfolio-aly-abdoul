import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanPath, detectDevice, isBot, referrerDomain, summarize, type AnalyticsEvent } from "../src/lib/analytics.ts";

const ev = (over: Partial<AnalyticsEvent>): AnalyticsEvent => ({
  type: "pageview", path: "/", referrer: null, target: null, device: "mobile", country: "BF", visitor: "v1",
  created_at: "2026-10-05T10:00:00Z", ...over,
});

describe("analytics", () => {
  it("détecte robots et appareils", () => {
    assert.equal(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
    assert.equal(isBot(""), true);
    assert.equal(isBot("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile/15E148 Safari/604.1"), false);
    assert.equal(detectDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) Mobile"), "mobile");
    assert.equal(detectDevice("Mozilla/5.0 (Linux; Android 14; SM-X200) Safari"), "tablet");
    assert.equal(detectDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130"), "desktop");
  });

  it("nettoie chemins et sources", () => {
    assert.equal(cleanPath("/blog/mon-article?utm=x#top"), "/blog/mon-article");
    assert.equal(cleanPath("https://evil.example"), null);
    assert.equal(referrerDomain("https://www.linkedin.com/feed/", "monsite.com"), "linkedin.com");
    assert.equal(referrerDomain("https://monsite.com/cv", "monsite.com"), null);
    assert.equal(referrerDomain("pas une url"), null);
  });

  it("agrège visites, visiteurs, sources et clics", () => {
    const events = [
      ev({ referrer: "linkedin.com" }),
      ev({ path: "/cv" }),
      ev({ visitor: "v2", device: "desktop", country: "FR" }),
      ev({ visitor: "v1", created_at: "2026-10-06T08:00:00Z" }),
      ev({ type: "cv_download", target: "https://drive.google.com/x", path: "/cv" }),
      ev({ type: "linkedin_click", target: "linkedin.com/in/aly" }),
      ev({ type: "contact_message", path: "/contact" }),
    ];
    const s = summarize(events, new Date("2026-10-04T00:00:00Z"), new Date("2026-10-06T12:00:00Z"));
    assert.equal(s.views, 4);
    assert.equal(s.visitors, 3); // v1 le 5, v2 le 5, v1 le 6
    assert.equal(s.counts.cv_download, 1);
    assert.equal(s.counts.contact_message, 1);
    assert.deepEqual(s.days.map((d) => [d.day, d.views, d.visitors]), [
      ["2026-10-04", 0, 0], ["2026-10-05", 3, 2], ["2026-10-06", 1, 1],
    ]);
    assert.deepEqual(s.pages[0], { key: "/", count: 3 });
    assert.deepEqual(s.sources, [{ key: "Accès direct", count: 2 }, { key: "linkedin.com", count: 1 }]);
    assert.deepEqual(s.devices, [{ key: "mobile", count: 2 }, { key: "desktop", count: 1 }]);
    assert.deepEqual(s.links, [{ key: "linkedin.com/in/aly", count: 1 }]);
  });
});
