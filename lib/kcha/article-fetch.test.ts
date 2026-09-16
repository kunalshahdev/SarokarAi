import { describe, expect, it } from "vitest";
import { isAllowedArticleUrl } from "./article-fetch";

describe("isAllowedArticleUrl", () => {
  it("allows known publisher URLs", () => {
    expect(isAllowedArticleUrl("https://www.onlinekhabar.com/2026/08/story")).toBe(true);
    expect(isAllowedArticleUrl("https://kathmandupost.com/national/2026/1/x")).toBe(true);
    expect(isAllowedArticleUrl("https://english.onlinekhabar.com/a-b-c")).toBe(true);
    expect(isAllowedArticleUrl("http://ratopati.com/post")).toBe(true);
  });

  it("allows any subdomain of an allowlisted base domain", () => {
    expect(isAllowedArticleUrl("https://amp.thehimalayantimes.com/x")).toBe(true);
    expect(isAllowedArticleUrl("https://nagariknews.nagariknetwork.com/y")).toBe(true);
  });

  it("rejects non-allowlisted hosts", () => {
    expect(isAllowedArticleUrl("https://evil.example.com/article")).toBe(false);
    // lookalike: allowlisted string is only a suffix, not a parent domain
    expect(isAllowedArticleUrl("https://onlinekhabar.com.evil.com/a")).toBe(false);
    expect(isAllowedArticleUrl("https://notonlinekhabar.com/a")).toBe(false);
  });

  it("rejects SSRF targets", () => {
    expect(isAllowedArticleUrl("http://localhost/article")).toBe(false);
    expect(isAllowedArticleUrl("http://127.0.0.1/article")).toBe(false);
    expect(isAllowedArticleUrl("http://169.254.169.254/latest/meta-data")).toBe(false);
    expect(isAllowedArticleUrl("http://10.0.0.1/a")).toBe(false);
    expect(isAllowedArticleUrl("file:///etc/passwd")).toBe(false);
  });

  it("rejects malformed URLs and unsupported protocols", () => {
    expect(isAllowedArticleUrl("not a url")).toBe(false);
    expect(isAllowedArticleUrl("ftp://onlinekhabar.com/a")).toBe(false);
    expect(isAllowedArticleUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedArticleUrl("")).toBe(false);
  });
});
