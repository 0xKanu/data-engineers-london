import * as fs from "node:fs";
import * as path from "node:path";
import { parseString } from "xml2js";

const RSS_URL = "https://www.meetup.com/data-engineers-london/events/rss/";
const EVENTS_DIR = path.resolve("src/content/events");

async function fetchRss() {
  const res = await fetch(RSS_URL);
  if (!res.ok) {
    console.log(`RSS feed returned ${res.status}, skipping.`);
    return [];
  }
  const xml = await res.text();
  return new Promise((resolve, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        console.error("Failed to parse RSS XML:", err.message);
        return resolve([]);
      }
      const items = result?.rss?.channel?.[0]?.item;
      resolve(items || []);
    });
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0];
}

function escapeYaml(value) {
  if (typeof value === "string" && /[:#\[\]{}'"!&|>%@`*]/.test(value)) {
    return JSON.stringify(value);
  }
  return value;
}

async function main() {
  const items = await fetchRss();
  if (items.length === 0) {
    console.log("No events found in RSS feed.");
    return;
  }

  if (!fs.existsSync(EVENTS_DIR)) {
    fs.mkdirSync(EVENTS_DIR, { recursive: true });
  }

  const existingFiles = new Set(fs.readdirSync(EVENTS_DIR));
  let created = 0;
  let skipped = 0;

  for (const item of items) {
    const title = item.title?.[0] || "Untitled Event";
    const link = item.link?.[0] || "";
    const pubDate = item.pubDate?.[0] || item.date?.[0] || "";
    const description = item.description?.[0] || "";
    const plainDesc = description.replace(/<[^>]*>/g, "").slice(0, 200);

    const dateStr = formatDate(pubDate);
    const nameSlug = slugify(title);
    const filename = `_meetup_${dateStr}-${nameSlug}.md`;

    if (existingFiles.has(filename)) {
      skipped++;
      continue;
    }

    const frontmatter = [
      "---",
      `title: ${escapeYaml(title)}`,
      `date: ${dateStr}`,
      "venue: TBA",
      "speakers: []",
      `meetupLink: ${escapeYaml(link)}`,
      `description: ${escapeYaml(plainDesc)}`,
      "---",
      "",
      plainDesc,
      "",
    ].join("\n");

    fs.writeFileSync(path.join(EVENTS_DIR, filename), frontmatter);
    created++;
    console.log(`Created: ${filename}`);
  }

  console.log(`Done — ${created} created, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
