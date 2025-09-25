/* eslint-disable no-console */
// transformBooks.ts
// Usage:
//   npx ts-node transformBooks.ts --in ./books-in.json --out ./books-out.json
//   npx ts-node transformBooks.ts --in ./books-in.json --out ./books-out.json --base-url https://cdn.example.com/books
//
// Notes:
// - Input expects an array of { Name: string; Extension: string }.
// - "Extension" can be "pdf" or ".pdf" — it will be normalized to ".pdf".
// - Output fields you didn't specify (Authors, Cover, etc.) are left empty/defaults.
// - If --base-url is present, "Source.Url" will be `${baseUrl}/${slugifiedTitle}${extension}` as a helpful default.
//   Otherwise, Url is left as "".

import { promises as fs } from "fs";
import * as path from "path";

type InputItem = {
  Name: string;
  Extension: string; // e.g. "pdf" or ".pdf"
};

// Output shape per your spec
type OutputItem = {
  Title: string;
  Type: "Book";
  BookType: "seccion-capitulo";
  Authors: string[];
  Source: Array<{ Extension: string; Url: string }>;
  Cover: string;
  Description: string;
  Edition: number;
  ISBN: string;
  Tags: string[];
  Categories: string[];
  Year: number;
  Contents: string[];
};

// ---------------- CLI args ----------------

function parseArgs(argv: string[]) {
  // very small arg parser (no dependency)
  const args: Record<string, string | true> = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.split("=");
      if (v !== undefined) {
        args[k.slice(2)] = v;
      } else {
        const next = argv[i + 1];
        if (next && !next.startsWith("--")) {
          args[a.slice(2)] = next;
          i++;
        } else {
          args[a.slice(2)] = true;
        }
      }
    }
  }
  const input = String(args["in"] || "");
  const output = String(args["out"] || "");
  const baseUrl = typeof args["base-url"] === "string" ? String(args["base-url"]) : undefined;

  if (!input || !output) {
    throw new Error(
      "Missing required args. Example:\n" +
        "  npx ts-node transformBooks.ts --in ./books-in.json --out ./books-out.json [--base-url https://cdn.example.com/books]",
    );
  }
  return { input, output, baseUrl };
}

// ---------------- Helpers ----------------

/** Normalize extension to start with a single "." (".pdf", ".epub", etc.) */
function normalizeExt(extRaw: string): string {
  const trimmed = (extRaw || "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith(".") ? trimmed.toLowerCase() : `.${trimmed.toLowerCase()}`;
}

/** Basic title cleaner; here we just trim whitespace. Extend if needed. */
function normalizeTitle(name: string): string {
  return (name || "").trim();
}

/** Make a conservative, URL-safe slug based on a title. */
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

/** Minimal validation for input record. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateInputItem(x: any, index: number): asserts x is InputItem {
  if (typeof x !== "object" || x === null) {
    throw new Error(`Input at index ${index} is not an object.`);
  }
  if (typeof x.Name !== "string" || !x.Name.trim()) {
    throw new Error(`Input at index ${index} has invalid "Name".`);
  }
  if (typeof x.Extension !== "string" || !x.Extension.trim()) {
    throw new Error(`Input at index ${index} has invalid "Extension".`);
  }
}

/** Build the output record from the input item. */
function toOutputItem(item: InputItem, baseUrl?: string): OutputItem {
  const Title = normalizeTitle(item.Name);
  const ext = normalizeExt(item.Extension);

  // Optional Source.Url generation if baseUrl is provided
  const url = baseUrl ? `${baseUrl.replace(/\/+$/, "")}/${slugifyTitle(Title)}${ext}` : "";

  const out: OutputItem = {
    Title,
    Type: "Book",
    BookType: "seccion-capitulo",
    Authors: [],
    Source: [{ Extension: ext.replace(/^\./, ""), Url: url }], // store extension without dot here? You asked `"Extension": ""`—if you prefer with dot, remove .replace
    Cover: "",
    Description: "",
    Edition: 0,
    ISBN: "",
    Tags: [],
    Categories: [],
    Year: 0,
    Contents: [],
  };

  return out;
}

// ---------------- Main ----------------

async function main() {
  const { input, output, baseUrl } = parseArgs(process.argv);

  // Read & parse
  const raw = await fs.readFile(path.join(__dirname, input), "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Failed to parse JSON from ${input}: ${(e as Error).message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error(`Input root must be an array.`);
  }

  // Validate & transform
  const out: OutputItem[] = data.map((x, i) => {
    validateInputItem(x, i);
    return toOutputItem(x, baseUrl);
  });

  // Write pretty JSON
  await fs.writeFile(path.join(__dirname, output), JSON.stringify(out, null, 2), "utf8");
  console.log(`✔ Wrote ${out.length} records to ${output}`);
}

main().catch((err) => {
  console.error("✖ Error:", err?.message || err);
  process.exit(1);
});
