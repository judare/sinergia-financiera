import puppeteer from "puppeteer";

export default class Scrapper {
  async getBodyText(url: string): Promise<string> {
    url = url.trim();
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", (req) => {
      let url = req.url();
      let resourceType = req.resourceType();
      let ext = url.split(".").pop();
      let invalidResourceTypes = ["image", "font", "media"];
      for (let invalidResourceType of invalidResourceTypes) {
        if (resourceType === invalidResourceType) {
          req.abort();
          return;
        }
      }

      let invalidExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      for (let invalidExtension of invalidExtensions) {
        if (ext === invalidExtension) {
          req.abort();
          return;
        }
      }

      let invalidUrls = [
        "google-analytics.com",
        "gstatic.com",
        "googleapis.com",
        "facebook.net",
        "facebook.com",
        "adroll",
        "googleads",
        "ads-twitter.com",
        "tiktok.com",
        "bing.com",
        "cloudflareinsights",
        "data:image",
        "event-tracker",
        "taboola",
        "hsadspixel",
        "googletagmanager",
        "fontawesome",
        "intercom.io",
        "googleoptimize.com",
        "hs-analytics",
        "logger",
        "amplitude.com",
        "google.com/recaptcha",
        "clarity.ms",
        "posthog.com",
        "pipedream",
        "ipregistry.co",
      ];
      for (let invalidUrl of invalidUrls) {
        if (url.includes(invalidUrl)) {
          req.abort();
          return;
        }
      }
      console.log("type", resourceType, url);
      req.continue();
    });

    // Custom user agent
    const customUA =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36";

    // Set custom user agent
    await page.setUserAgent(customUA);

    await page.goto(url, { waitUntil: "networkidle0" });

    await page.screenshot({ path: "./tmp/website1.png" });

    let content = await page.evaluate(() => {
      const clone: any = document.body.cloneNode(true);
      clone
        .querySelectorAll(
          "header, footer, nav, aside, script, style, img, iframe, noscript, select, textarea, input, button, footer, [aria-selected]"
        )
        .forEach((el: any) => el.remove());

      return clone.innerText.trim();
    });

    // save screenshot
    await page.screenshot({ path: "./tmp/website2.png" });

    content = content.replace(/\n|\t/g, " ").replace(/ {2,}/g, " ");
    await browser.close();
    return content;
  }
}
