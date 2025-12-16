import { ScriptMetaSchema, type Script } from "./scriptSchema";

/**
 * Content loader: single responsibility
 * - Load markdown files from content/scripts/
 * - Parse frontmatter (browser-compatible, no Node.js dependencies)
 * - Validate against schema
 * - Return structured Script data
 */

const scriptsGlob = import.meta.glob("../content/scripts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function filenameToSlug(pathname: string): string {
  const parts = pathname.split("/");
  const file = parts[parts.length - 1] ?? "";
  return file.replace(/\.md$/, "");
}

/**
 * Browser-compatible frontmatter parser.
 * Parses YAML frontmatter between --- markers without Node.js Buffer/fs dependencies.
 * 
 * Note: `data` uses `unknown` instead of strict types because YAML frontmatter
 * can contain arbitrary values. The data is validated against ScriptMetaSchema
 * after parsing, which provides type safety.
 */
function parseFrontmatter(content: string): { data: Record<string, unknown>, content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }

  const [, frontmatter, body] = match;
  const data: Record<string, unknown> = {};
  
  // Simple YAML parser for our use case
  frontmatter.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();
    
    // Parse arrays (format: ["item1", "item2"] or [item1, item2])
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1).trim();
      if (arrayContent === '') {
        data[key] = [];
      } else {
        data[key] = arrayContent
          .split(',')
          .map(item => item.trim().replace(/^["']|["']$/g, ''))
          .filter(item => item.length > 0);
      }
    } else {
      // Remove quotes if present (both single and double)
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse numbers (integers and floats)
      const numValue = Number(value);
      if (value !== '' && !isNaN(numValue) && isFinite(numValue)) {
        // Check if it's an integer or float
        data[key] = Number.isInteger(numValue) ? parseInt(value, 10) : parseFloat(value);
      } else {
        // String value
        data[key] = value;
      }
    }
  });
  
  return { data, content: body.trim() };
}

/**
 * Core loading function: transforms raw markdown files into validated Script objects.
 * Filters drafts, validates schema, sorts by date.
 */
function buildAllScripts(): Script[] {
  const entries = Object.entries(scriptsGlob);

  const scripts: Script[] = entries.map(([filepath, raw]) => {
    const slug = filenameToSlug(filepath);
    const { data, content } = parseFrontmatter(String(raw));

    const parsed = ScriptMetaSchema.safeParse(data);
    if (!parsed.success) {
      if (import.meta.env.DEV) {
        console.error(`Frontmatter invalid for: ${slug}`);
        console.error('Parsed data:', JSON.stringify(data, null, 2));
        console.error('Validation errors:', parsed.error.flatten());
        console.error('Full error:', parsed.error.format());
      }
      throw new Error(`Invalid frontmatter in ${slug}.md`);
    }

    return {
      slug,
      meta: parsed.data,
      content,
    };
  });

  // Filter drafts (only show published in production)
  const published = scripts.filter((s) => s.meta.status === "published");
  const drafts = scripts.filter((s) => s.meta.status === "draft");

  if (drafts.length > 0 && import.meta.env.DEV) {
    console.warn(
      `⚠️ ${drafts.length} draft script(s) hidden: ${drafts.map((s) => s.slug).join(", ")}`
    );
  }

  // Sort newest first
  published.sort((a, b) => (b.meta.date || "").localeCompare(a.meta.date || ""));

  return published;
}

// Load once at module scope - deterministic, immutable knowledgebase
const allScripts: Script[] = buildAllScripts();

// ============================================================================
// Core API: direct access to loaded scripts
// ============================================================================

export function getAllScripts(): Script[] {
  return allScripts;
}

export function getScriptBySlug(slug: string): Script | undefined {
  return allScripts.find((s) => s.slug === slug);
}

// ============================================================================
// Query helpers: convenience functions operating on loaded data
// ============================================================================

export function getRelatedScripts(currentSlug: string, limit: number = 3): Script[] {
  const current = getScriptBySlug(currentSlug);
  if (!current) return [];

  // Prefer explicit related articles if defined
  if (current.meta.related && current.meta.related.length > 0) {
    return current.meta.related
      .map(slug => getScriptBySlug(slug))
      .filter((script): script is Script => script !== undefined)
      .slice(0, limit);
  }

  // Fallback: find by tag overlap
  const currentTags = new Set(current.meta.tags);
  return allScripts
    .filter(s => s.slug !== currentSlug)
    .map(s => ({
      script: s,
      score: s.meta.tags.filter(tag => currentTags.has(tag)).length
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.script);
}

export function getNextScript(currentSlug: string): Script | undefined {
  const currentIndex = allScripts.findIndex(s => s.slug === currentSlug);
  if (currentIndex === -1 || currentIndex === allScripts.length - 1) return undefined;
  return allScripts[currentIndex + 1];
}

export function getPreviousScript(currentSlug: string): Script | undefined {
  const currentIndex = allScripts.findIndex(s => s.slug === currentSlug);
  if (currentIndex <= 0) return undefined;
  return allScripts[currentIndex - 1];
}

export function searchScripts(query: string): Script[] {
  if (!query.trim()) return allScripts;
  
  const lowerQuery = query.toLowerCase();
  return allScripts.filter(script => {
    // Search in title
    if (script.meta.title.toLowerCase().includes(lowerQuery)) return true;
    // Search in summary
    if (script.meta.summary.toLowerCase().includes(lowerQuery)) return true;
    // Search in content
    if (script.content.toLowerCase().includes(lowerQuery)) return true;
    // Search in tags
    if (script.meta.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;
    return false;
  });
}

export function getScriptsByCategory(category: string): Script[] {
  return allScripts.filter(s => s.meta.category === category);
}

export function getAllCategories(): string[] {
  const categories = new Set<string>();
  allScripts.forEach(script => {
    if (script.meta.category) {
      categories.add(script.meta.category);
    }
  });
  return Array.from(categories).sort();
}
