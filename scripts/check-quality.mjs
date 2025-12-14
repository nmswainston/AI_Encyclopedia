#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPTS_DIR = path.resolve(__dirname, "../src/content/scripts");

function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }

  const [, frontmatter, body] = match;
  const data = {};
  
  frontmatter.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = trimmed.slice(0, colonIndex).trim();
    let value = trimmed.slice(colonIndex + 1).trim();
    
    if (value.startsWith('[') && value.endsWith(']')) {
      const arrayContent = value.slice(1, -1);
      data[key] = arrayContent
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''))
        .filter(item => item.length > 0);
    } else {
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (!isNaN(Number(value)) && value.trim() !== '' && !isNaN(parseFloat(value))) {
        data[key] = Number(value);
      } else {
        data[key] = value;
      }
    }
  });
  
  return { data, content: body.trim() };
}

function extractHeadings(content) {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const matches = [...content.matchAll(headingRegex)];
  return matches.map(m => m[1].trim());
}

function extractLinks(content) {
  const linkRegex = /\[([^\]]+)\]\([^\)]+\)/g;
  const matches = [...content.matchAll(linkRegex)];
  return matches.map(m => m[1].trim());
}

function hasMath(content) {
  return /(\$\$?[^\$]+\$\$?|\\\[[^\]]+\\\]|\\\([^\)]+\\\))/.test(content);
}

function hasFormulas(content) {
  return /(\$\$[^\$]+\$\$|\\\[[^\]]+\\\])/.test(content);
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function checkQuality(slug, meta, content) {
  const checks = [];
  const headings = extractHeadings(content);
  const links = extractLinks(content);
  const firstParagraph = content.split('\n\n').find(p => p.trim().length > 20) || '';
  const wordCountTotal = wordCount(content);

  // 1. Intent & Audience
  checks.push({
    id: '1.1',
    category: 'Intent & Audience',
    description: 'Title clearly states what and who it\'s for',
    passed: meta.title?.length > 10 && !meta.title.toLowerCase().includes('untitled'),
    message: meta.title?.length <= 10 ? 'Title is too short' : undefined
  });

  checks.push({
    id: '1.2',
    category: 'Intent & Audience',
    description: 'Summary explains the value in one sentence',
    passed: meta.summary?.length > 20 && meta.summary.length < 200 && !meta.summary.includes('..'),
    message: meta.summary?.length < 20 ? 'Summary is too short' : meta.summary?.length > 200 ? 'Summary is too long' : undefined
  });

  checks.push({
    id: '1.3',
    category: 'Intent & Audience',
    description: 'Audience or prerequisites explicitly stated',
    passed: (meta.prerequisites && meta.prerequisites.length > 0) || 
            content.toLowerCase().includes('prerequisite') ||
            content.toLowerCase().includes('audience') ||
            content.toLowerCase().includes('who should') ||
            (content.toLowerCase().includes('for ') && content.toLowerCase().includes('who'))
  });

  checks.push({
    id: '1.4',
    category: 'Intent & Audience',
    description: 'Level matches actual complexity',
    passed: true,
    message: 'Requires manual review'
  });

  // 2. Scope & Boundaries
  checks.push({
    id: '2.1',
    category: 'Scope & Boundaries',
    description: 'Opening defines what the concept is',
    passed: firstParagraph.length > 50 && (
      firstParagraph.toLowerCase().includes('is ') ||
      firstParagraph.toLowerCase().includes('are ') ||
      firstParagraph.toLowerCase().includes('means ') ||
      firstParagraph.toLowerCase().includes('refers to')
    ),
    message: firstParagraph.length < 50 ? 'Opening is too short' : undefined
  });

  checks.push({
    id: '2.2',
    category: 'Scope & Boundaries',
    description: 'Opening briefly states what it is not',
    passed: content.toLowerCase().includes('not ') && (
      content.toLowerCase().includes('not the same') ||
      content.toLowerCase().includes('not to be confused') ||
      content.toLowerCase().includes('different from') ||
      content.toLowerCase().includes('unlike')
    )
  });

  checks.push({
    id: '2.3',
    category: 'Scope & Boundaries',
    description: 'Mental models are labeled as abstractions',
    passed: !content.toLowerCase().includes('think of it as') || 
            content.toLowerCase().includes('analogy') ||
            content.toLowerCase().includes('metaphor') ||
            content.toLowerCase().includes('simplified')
  });

  checks.push({
    id: '2.4',
    category: 'Scope & Boundaries',
    description: 'Article avoids drifting into adjacent topics',
    passed: true,
    message: 'Requires manual review'
  });

  // 3. Structure & Flow
  checks.push({
    id: '3.1',
    category: 'Structure & Flow',
    description: 'Clear conceptual explanation before details',
    passed: headings.length >= 2 && (
      headings[0].toLowerCase().includes('what') ||
      headings[0].toLowerCase().includes('introduction') ||
      headings[0].toLowerCase().includes('overview') ||
      headings[0].toLowerCase().includes('core')
    )
  });

  checks.push({
    id: '3.2',
    category: 'Structure & Flow',
    description: 'Sections follow a consistent order',
    passed: headings.length >= 3,
    message: headings.length < 3 ? 'Article may lack structure' : undefined
  });

  checks.push({
    id: '3.3',
    category: 'Structure & Flow',
    description: 'Headings are descriptive, not clever',
    passed: !headings.some(h => h.length > 50 || h.includes('?') || h.includes('!'))
  });

  checks.push({
    id: '3.4',
    category: 'Structure & Flow',
    description: 'Ending reinforces the core idea without adding new ones',
    passed: content.toLowerCase().includes('takeaway') ||
            content.toLowerCase().includes('summary') ||
            content.toLowerCase().includes('remember') ||
            content.toLowerCase().includes('key point')
  });

  // 4. Concept Connections
  checks.push({
    id: '4.1',
    category: 'Concept Connections',
    description: 'Key terms are linked to other entries',
    passed: links.length > 0,
    message: links.length === 0 ? 'No internal links found' : undefined
  });

  checks.push({
    id: '4.2',
    category: 'Concept Connections',
    description: 'Related concepts are acknowledged',
    passed: (meta.related && meta.related.length > 0) ||
            content.toLowerCase().includes('related') ||
            content.toLowerCase().includes('see also') ||
            content.toLowerCase().includes('similar')
  });

  checks.push({
    id: '4.3',
    category: 'Concept Connections',
    description: '"Related concepts" section exists',
    passed: (meta.related && meta.related.length > 0) ||
            headings.some(h => h.toLowerCase().includes('related'))
  });

  checks.push({
    id: '4.4',
    category: 'Concept Connections',
    description: 'No orphan concepts mentioned without context',
    passed: true,
    message: 'Requires manual review'
  });

  // 5. Technical Discipline
  checks.push({
    id: '5.1',
    category: 'Technical Discipline',
    description: 'Math is introduced only when necessary',
    passed: !hasMath(content) || 
            content.toLowerCase().includes('formula') ||
            content.toLowerCase().includes('calculate') ||
            content.toLowerCase().includes('mathematical'),
    message: hasMath(content) ? 'Math found - verify it\'s necessary' : undefined
  });

  checks.push({
    id: '5.2',
    category: 'Technical Discipline',
    description: 'Each technical term is defined on first use',
    passed: true,
    message: 'Requires manual review'
  });

  checks.push({
    id: '5.3',
    category: 'Technical Discipline',
    description: 'Formulas are explained conceptually',
    passed: !hasFormulas(content) ||
            (hasFormulas(content) && (
              content.toLowerCase().includes('means') ||
              content.toLowerCase().includes('represents') ||
              content.toLowerCase().includes('explain')
            )),
    message: hasFormulas(content) ? 'Verify formulas are explained' : undefined
  });

  checks.push({
    id: '5.4',
    category: 'Technical Discipline',
    description: 'Warnings or limitations are stated where relevant',
    passed: content.toLowerCase().includes('warning') ||
            content.toLowerCase().includes('limitation') ||
            content.toLowerCase().includes('pitfall') ||
            content.toLowerCase().includes('common mistake') ||
            content.toLowerCase().includes('caution')
  });

  // 6. Practical Value
  checks.push({
    id: '6.1',
    category: 'Practical Value',
    description: 'Includes real-world symptoms or failure modes',
    passed: content.toLowerCase().includes('mistake') ||
            content.toLowerCase().includes('error') ||
            content.toLowerCase().includes('problem') ||
            content.toLowerCase().includes('issue') ||
            content.toLowerCase().includes('pitfall')
  });

  checks.push({
    id: '6.2',
    category: 'Practical Value',
    description: 'Fixes are actionable and concise',
    passed: content.toLowerCase().includes('step') ||
            content.toLowerCase().includes('how to') ||
            content.toLowerCase().includes('solution') ||
            headings.some(h => h.toLowerCase().includes('how'))
  });

  checks.push({
    id: '6.3',
    category: 'Practical Value',
    description: 'Checklist or diagnostic guidance included',
    passed: content.includes('-') && content.split('-').length > 3 ||
            content.toLowerCase().includes('checklist')
  });

  checks.push({
    id: '6.4',
    category: 'Practical Value',
    description: 'Advice aligns with how practitioners actually work',
    passed: true,
    message: 'Requires manual review'
  });

  // 7. Consistency & Trust Signals
  checks.push({
    id: '7.1',
    category: 'Consistency & Trust Signals',
    description: 'Tone matches other entries',
    passed: true,
    message: 'Requires comparison with other entries'
  });

  checks.push({
    id: '7.2',
    category: 'Consistency & Trust Signals',
    description: 'Front matter fields are complete and accurate',
    passed: meta.title && meta.summary && meta.level && meta.date && meta.status,
    message: !meta.date ? 'Date is missing' : !meta.status ? 'Status is missing' : undefined
  });

  checks.push({
    id: '7.3',
    category: 'Consistency & Trust Signals',
    description: 'Dates or "last updated" info present',
    passed: !!meta.date || !!meta.lastUpdated,
    message: !meta.date && !meta.lastUpdated ? 'No date information' : undefined
  });

  checks.push({
    id: '7.4',
    category: 'Consistency & Trust Signals',
    description: 'No contradictions with existing entries',
    passed: true,
    message: 'Requires comparison with other entries'
  });

  // 8. Future-Proofing
  checks.push({
    id: '8.1',
    category: 'Future-Proofing',
    description: 'Entry can stand alone without external context',
    passed: wordCountTotal > 200 && firstParagraph.length > 50,
    message: wordCountTotal < 200 ? 'Content may be too brief' : undefined
  });

  checks.push({
    id: '8.2',
    category: 'Future-Proofing',
    description: 'Easy to update without rewriting everything',
    passed: headings.length >= 3,
    message: headings.length < 3 ? 'Structure may be too flat' : undefined
  });

  checks.push({
    id: '8.3',
    category: 'Future-Proofing',
    description: 'Leaves room for deeper follow-up entries',
    passed: true,
    message: 'Requires manual review'
  });

  checks.push({
    id: '8.4',
    category: 'Future-Proofing',
    description: 'Does not rely on AI features to be useful',
    passed: true,
    message: 'Requires manual review'
  });

  const passed = checks.filter(c => c.passed).length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  return { slug, title: meta.title || 'Untitled', checks, score, passed, total };
}

function formatReport(report, verbose = false) {
  const lines = [];
  lines.push(`\n${'='.repeat(60)}`);
  lines.push(`📄 ${report.title} (${report.slug})`);
  lines.push(`${'='.repeat(60)}`);
  lines.push(`Score: ${report.score}% (${report.passed}/${report.total} checks passed)\n`);

  const byCategory = {};
  report.checks.forEach(check => {
    if (!byCategory[check.category]) {
      byCategory[check.category] = [];
    }
    byCategory[check.category].push(check);
  });

  Object.entries(byCategory).forEach(([category, categoryChecks]) => {
    const categoryPassed = categoryChecks.filter(c => c.passed).length;
    const categoryTotal = categoryChecks.length;
    const categoryScore = Math.round((categoryPassed / categoryTotal) * 100);
    
    const icon = categoryScore === 100 ? '✅' : categoryScore >= 75 ? '⚠️' : '❌';
    lines.push(`${icon} ${category} (${categoryScore}% - ${categoryPassed}/${categoryTotal})`);
    
    if (verbose) {
      categoryChecks.forEach(check => {
        const status = check.passed ? '✓' : '✗';
        const msg = check.message ? ` - ${check.message}` : '';
        lines.push(`  ${status} ${check.id} ${check.description}${msg}`);
      });
    } else {
      categoryChecks.filter(c => !c.passed).forEach(check => {
        const msg = check.message ? ` - ${check.message}` : '';
        lines.push(`  ✗ ${check.id} ${check.description}${msg}`);
      });
    }
    lines.push('');
  });

  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose') || args.includes('-v');
  const specificFile = args.find(arg => !arg.startsWith('--') && !arg.startsWith('-'));

  if (!fs.existsSync(SCRIPTS_DIR)) {
    console.error(`Scripts directory not found: ${SCRIPTS_DIR}`);
    process.exit(1);
  }

  const files = specificFile 
    ? [path.join(SCRIPTS_DIR, specificFile.endsWith('.md') ? specificFile : `${specificFile}.md`)]
    : fs.readdirSync(SCRIPTS_DIR).filter(f => f.endsWith('.md'));

  if (files.length === 0) {
    console.error('No markdown files found');
    process.exit(1);
  }

  const reports = [];
  for (const file of files) {
    const fullPath = path.isAbsolute(file) ? file : path.join(SCRIPTS_DIR, file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const { data: meta, content: body } = parseFrontmatter(content);
    const slug = path.basename(fullPath, '.md');
    
    const report = checkQuality(slug, meta, body);
    reports.push(report);
  }

  // Sort by score (lowest first)
  reports.sort((a, b) => a.score - b.score);

  console.log('\n📊 Knowledgebase Entry Quality Report\n');
  console.log(`Checked ${reports.length} file(s)\n`);

  reports.forEach(report => {
    console.log(formatReport(report, verbose));
  });

  const avgScore = Math.round(reports.reduce((sum, r) => sum + r.score, 0) / reports.length);
  const totalPassed = reports.reduce((sum, r) => sum + r.passed, 0);
  const totalChecks = reports.reduce((sum, r) => sum + r.total, 0);

  console.log(`${'='.repeat(60)}`);
  console.log(`Overall Average: ${avgScore}% (${totalPassed}/${totalChecks} checks passed)`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
