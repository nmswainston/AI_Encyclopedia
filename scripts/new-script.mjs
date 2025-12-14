#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust if your content path differs
const SCRIPTS_DIR = path.resolve(__dirname, "../src/content/scripts");

function slugify(input) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseTags(input) {
  if (!input?.trim()) return [];
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map(slugify);
}

function safeNumber(input, fallback) {
  const n = Number(String(input).trim());
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function ask(rl, question, defaultValue = "") {
  const q = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
  return new Promise((resolve) => {
    rl.question(q, (answer) => {
      const v = answer.trim();
      resolve(v || defaultValue);
    });
  });
}

async function main() {
  if (!fs.existsSync(SCRIPTS_DIR)) {
    console.error(`Scripts directory not found: ${SCRIPTS_DIR}`);
    console.error("Create it or update SCRIPTS_DIR in scripts/new-script.mjs");
    process.exit(1);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const title = await ask(rl, "Title");
    if (!title.trim()) {
      console.error("Title is required.");
      process.exit(1);
    }

    const suggestedSlug = slugify(title);
    const slug = await ask(rl, "Slug (filename)", suggestedSlug);

    const summary = await ask(rl, "Summary (1 sentence)");
    const level = await ask(rl, "Level [beginner|intermediate|advanced]", "beginner");
    const minutesRaw = await ask(rl, "Minutes to read", "8");
    const minutes = safeNumber(minutesRaw, 8);

    const tagsRaw = await ask(rl, "Tags (comma-separated)", "");
    const tags = parseTags(tagsRaw);

    const status = await ask(rl, "Status [draft|published]", "published");
    const date = await ask(rl, "Date (YYYY-MM-DD)", todayISO());

    const filename = `${slug}.md`;
    const fullPath = path.join(SCRIPTS_DIR, filename);

    if (fs.existsSync(fullPath)) {
      console.error(`File already exists: ${fullPath}`);
      process.exit(1);
    }

    const content = `---
title: "${title.replace(/"/g, '\\"')}"
summary: "${summary.replace(/"/g, '\\"')}"
level: "${level}"
minutes: ${minutes}
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
date: "${date}"
status: "${status}"
---

# ${title}

## What you will learn
- 

## Core idea
Write the plain-English explanation here.

## Practical example
Give a real scenario a technician or builder would recognize.

## Common mistakes
- 

## Quick takeaway
One or two sentences someone can remember.
`;

    fs.writeFileSync(fullPath, content, "utf8");

    console.log("");
    console.log("Created:");
    console.log(fullPath);
    console.log("");
    console.log("Next steps:");
    console.log("1) Fill in the sections");
    console.log("2) Save");
    console.log("3) Your library should pick it up automatically");
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
