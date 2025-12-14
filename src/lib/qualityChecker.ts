import type { Script } from "./scriptSchema";

export interface QualityCheck {
  id: string;
  category: string;
  description: string;
  passed: boolean;
  message?: string;
  suggestion?: string;
}

export interface QualityReport {
  slug: string;
  title: string;
  checks: QualityCheck[];
  score: number;
  passed: number;
  total: number;
}

/**
 * Knowledgebase Entry Quality Checklist Validator
 * Implements the 8-category quality checklist for knowledgebase entries
 */

function extractHeadings(content: string): string[] {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const matches = content.matchAll(headingRegex);
  return Array.from(matches, m => m[1].trim());
}

function extractLinks(content: string): string[] {
  const linkRegex = /\[([^\]]+)\]\([^)]+\)/g;
  const matches = content.matchAll(linkRegex);
  return Array.from(matches, m => m[1].trim());
}

function hasMath(content: string): boolean {
  return /(\$\$?[^$]+\$\$?|\\\[[^\]]+\\\]|\\\([^)]+\\\))/.test(content);
}

function hasFormulas(content: string): boolean {
  return /(\$\$[^$]+\$\$|\\\[[^\]]+\\\])/.test(content);
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export function checkQuality(script: Script): QualityReport {
  const checks: QualityCheck[] = [];
  const { meta, content } = script;
  const headings = extractHeadings(content);
  const links = extractLinks(content);
  const firstParagraph = content.split('\n\n').find(p => p.trim().length > 20) || '';
  const wordCountTotal = wordCount(content);

  // ============================================================================
  // 1. Intent & Audience
  // ============================================================================
  
  // 1.1 Title clearly states what and who it's for
  checks.push({
    id: '1.1',
    category: 'Intent & Audience',
    description: 'Title clearly states what and who it\'s for',
    passed: meta.title.length > 10 && !meta.title.toLowerCase().includes('untitled'),
    message: meta.title.length <= 10 ? 'Title is too short' : undefined,
    suggestion: 'Ensure title clearly describes the topic and target audience'
  });

  // 1.2 Summary explains the value in one sentence
  checks.push({
    id: '1.2',
    category: 'Intent & Audience',
    description: 'Summary explains the value in one sentence',
    passed: meta.summary.length > 20 && meta.summary.length < 200 && !meta.summary.includes('..'),
    message: meta.summary.length < 20 ? 'Summary is too short' : meta.summary.length > 200 ? 'Summary is too long' : undefined,
    suggestion: 'Summary should be one clear sentence explaining the value'
  });

  // 1.3 Audience or prerequisites explicitly stated
  checks.push({
    id: '1.3',
    category: 'Intent & Audience',
    description: 'Audience or prerequisites explicitly stated',
    passed: (meta.prerequisites && meta.prerequisites.length > 0) || 
            content.toLowerCase().includes('prerequisite') ||
            content.toLowerCase().includes('audience') ||
            content.toLowerCase().includes('who should') ||
            content.toLowerCase().includes('for ') && content.toLowerCase().includes('who'),
    suggestion: 'Add prerequisites field or mention target audience in content'
  });

  // 1.4 Level matches actual complexity
  checks.push({
    id: '1.4',
    category: 'Intent & Audience',
    description: 'Level matches actual complexity (not aspirational)',
    passed: true, // This requires manual review
    message: 'Requires manual review',
    suggestion: 'Verify that the level accurately reflects the content complexity'
  });

  // ============================================================================
  // 2. Scope & Boundaries
  // ============================================================================

  // 2.1 Opening defines what the concept is
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
    message: firstParagraph.length < 50 ? 'Opening is too short' : 'Opening may not clearly define the concept',
    suggestion: 'Start with a clear definition: "X is..." or "X refers to..."'
  });

  // 2.2 Opening briefly states what it is not
  checks.push({
    id: '2.2',
    category: 'Scope & Boundaries',
    description: 'Opening briefly states what it is not',
    passed: content.toLowerCase().includes('not ') && (
      content.toLowerCase().includes('not the same') ||
      content.toLowerCase().includes('not to be confused') ||
      content.toLowerCase().includes('different from') ||
      content.toLowerCase().includes('unlike')
    ),
    suggestion: 'Consider clarifying what the concept is NOT to set boundaries'
  });

  // 2.3 Mental models are labeled as abstractions
  checks.push({
    id: '2.3',
    category: 'Scope & Boundaries',
    description: 'Mental models are labeled as abstractions',
    passed: !content.toLowerCase().includes('think of it as') || 
            content.toLowerCase().includes('analogy') ||
            content.toLowerCase().includes('metaphor') ||
            content.toLowerCase().includes('simplified'),
    suggestion: 'When using analogies, label them explicitly (e.g., "Think of it as...")'
  });

  // 2.4 Article avoids drifting into adjacent topics
  checks.push({
    id: '2.4',
    category: 'Scope & Boundaries',
    description: 'Article avoids drifting into adjacent topics',
    passed: true, // Requires manual review
    message: 'Requires manual review',
    suggestion: 'Ensure the article stays focused on the main topic'
  });

  // ============================================================================
  // 3. Structure & Flow
  // ============================================================================

  // 3.1 Clear conceptual explanation before details
  checks.push({
    id: '3.1',
    category: 'Structure & Flow',
    description: 'Clear conceptual explanation before details',
    passed: headings.length >= 2 && (
      headings[0].toLowerCase().includes('what') ||
      headings[0].toLowerCase().includes('introduction') ||
      headings[0].toLowerCase().includes('overview') ||
      headings[0].toLowerCase().includes('core')
    ),
    suggestion: 'Start with conceptual overview before diving into details'
  });

  // 3.2 Sections follow a consistent order
  checks.push({
    id: '3.2',
    category: 'Structure & Flow',
    description: 'Sections follow a consistent order',
    passed: headings.length >= 3,
    message: headings.length < 3 ? 'Article may lack structure' : undefined,
    suggestion: 'Use consistent section ordering across entries'
  });

  // 3.3 Headings are descriptive, not clever
  checks.push({
    id: '3.3',
    category: 'Structure & Flow',
    description: 'Headings are descriptive, not clever',
    passed: !headings.some(h => h.length > 50 || h.includes('?') || h.includes('!')),
    suggestion: 'Use clear, descriptive headings that state what the section covers'
  });

  // 3.4 Ending reinforces the core idea without adding new ones
  checks.push({
    id: '3.4',
    category: 'Structure & Flow',
    description: 'Ending reinforces the core idea without adding new ones',
    passed: content.toLowerCase().includes('takeaway') ||
            content.toLowerCase().includes('summary') ||
            content.toLowerCase().includes('remember') ||
            content.toLowerCase().includes('key point'),
    suggestion: 'End with a clear takeaway that reinforces the main concept'
  });

  // ============================================================================
  // 4. Concept Connections
  // ============================================================================

  // 4.1 Key terms are linked to other entries
  checks.push({
    id: '4.1',
    category: 'Concept Connections',
    description: 'Key terms are linked to other entries',
    passed: links.length > 0,
    message: links.length === 0 ? 'No internal links found' : undefined,
    suggestion: 'Link key terms to related entries using markdown links'
  });

  // 4.2 Related concepts are acknowledged (even if deferred)
  checks.push({
    id: '4.2',
    category: 'Concept Connections',
    description: 'Related concepts are acknowledged (even if deferred)',
    passed: (meta.related && meta.related.length > 0) ||
            content.toLowerCase().includes('related') ||
            content.toLowerCase().includes('see also') ||
            content.toLowerCase().includes('similar'),
    suggestion: 'Acknowledge related concepts or use the related field in frontmatter'
  });

  // 4.3 "Related concepts" section exists or is planned
  checks.push({
    id: '4.3',
    category: 'Concept Connections',
    description: '"Related concepts" section exists or is planned',
    passed: (meta.related && meta.related.length > 0) ||
            headings.some(h => h.toLowerCase().includes('related')),
    suggestion: 'Add a "Related concepts" section or populate the related field'
  });

  // 4.4 No orphan concepts mentioned without context
  checks.push({
    id: '4.4',
    category: 'Concept Connections',
    description: 'No orphan concepts mentioned without context',
    passed: true, // Requires manual review
    message: 'Requires manual review',
    suggestion: 'Ensure all mentioned concepts are either explained or linked'
  });

  // ============================================================================
  // 5. Technical Discipline
  // ============================================================================

  // 5.1 Math is introduced only when necessary
  checks.push({
    id: '5.1',
    category: 'Technical Discipline',
    description: 'Math is introduced only when necessary',
    passed: !hasMath(content) || 
            content.toLowerCase().includes('formula') ||
            content.toLowerCase().includes('calculate') ||
            content.toLowerCase().includes('mathematical'),
    message: hasMath(content) ? 'Math found - verify it\'s necessary' : undefined,
    suggestion: 'Only include math if it\'s essential to understanding'
  });

  // 5.2 Each technical term is defined on first use
  checks.push({
    id: '5.2',
    category: 'Technical Discipline',
    description: 'Each technical term is defined on first use',
    passed: true, // Requires manual review
    message: 'Requires manual review',
    suggestion: 'Define technical terms when first introduced'
  });

  // 5.3 Formulas are explained conceptually, not just shown
  checks.push({
    id: '5.3',
    category: 'Technical Discipline',
    description: 'Formulas are explained conceptually, not just shown',
    passed: !hasFormulas(content) ||
            (hasFormulas(content) && (
              content.toLowerCase().includes('means') ||
              content.toLowerCase().includes('represents') ||
              content.toLowerCase().includes('explain')
            )),
    message: hasFormulas(content) ? 'Verify formulas are explained' : undefined,
    suggestion: 'Always explain what formulas mean, not just show them'
  });

  // 5.4 Warnings or limitations are stated where relevant
  checks.push({
    id: '5.4',
    category: 'Technical Discipline',
    description: 'Warnings or limitations are stated where relevant',
    passed: content.toLowerCase().includes('warning') ||
            content.toLowerCase().includes('limitation') ||
            content.toLowerCase().includes('pitfall') ||
            content.toLowerCase().includes('common mistake') ||
            content.toLowerCase().includes('caution'),
    suggestion: 'Include warnings or limitations where applicable'
  });

  // ============================================================================
  // 6. Practical Value
  // ============================================================================

  // 6.1 Includes real-world symptoms or failure modes
  checks.push({
    id: '6.1',
    category: 'Practical Value',
    description: 'Includes real-world symptoms or failure modes',
    passed: content.toLowerCase().includes('mistake') ||
            content.toLowerCase().includes('error') ||
            content.toLowerCase().includes('problem') ||
            content.toLowerCase().includes('issue') ||
            content.toLowerCase().includes('pitfall'),
    suggestion: 'Include real-world problems or failure modes'
  });

  // 6.2 Fixes are actionable and concise
  checks.push({
    id: '6.2',
    category: 'Practical Value',
    description: 'Fixes are actionable and concise',
    passed: content.toLowerCase().includes('step') ||
            content.toLowerCase().includes('how to') ||
            content.toLowerCase().includes('solution') ||
            headings.some(h => h.toLowerCase().includes('how')),
    suggestion: 'Provide actionable, step-by-step guidance where applicable'
  });

  // 6.3 Checklist or diagnostic guidance included where appropriate
  checks.push({
    id: '6.3',
    category: 'Practical Value',
    description: 'Checklist or diagnostic guidance included where appropriate',
    passed: content.includes('-') && content.split('-').length > 3 ||
            content.toLowerCase().includes('checklist'),
    suggestion: 'Consider adding checklists or diagnostic steps where helpful'
  });

  // 6.4 Advice aligns with how practitioners actually work
  checks.push({
    id: '6.4',
    category: 'Practical Value',
    description: 'Advice aligns with how practitioners actually work',
    passed: true, // Requires manual review
    message: 'Requires manual review',
    suggestion: 'Ensure advice matches real-world practice'
  });

  // ============================================================================
  // 7. Consistency & Trust Signals
  // ============================================================================

  // 7.1 Tone matches other entries
  checks.push({
    id: '7.1',
    category: 'Consistency & Trust Signals',
    description: 'Tone matches other entries',
    passed: true, // Requires comparison with other entries
    message: 'Requires comparison with other entries',
    suggestion: 'Maintain consistent tone across all entries'
  });

  // 7.2 Front matter fields are complete and accurate
  checks.push({
    id: '7.2',
    category: 'Consistency & Trust Signals',
    description: 'Front matter fields are complete and accurate',
    passed: !!(meta.title && meta.summary && meta.level && meta.date && meta.status),
    message: !meta.date ? 'Date is missing' : !meta.status ? 'Status is missing' : undefined,
    suggestion: 'Ensure all required frontmatter fields are present'
  });

  // 7.3 Dates or "last updated" info present
  checks.push({
    id: '7.3',
    category: 'Consistency & Trust Signals',
    description: 'Dates or "last updated" info present',
    passed: !!meta.date || !!meta.lastUpdated,
    message: !meta.date && !meta.lastUpdated ? 'No date information' : undefined,
    suggestion: 'Include date or lastUpdated field'
  });

  // 7.4 No contradictions with existing entries
  checks.push({
    id: '7.4',
    category: 'Consistency & Trust Signals',
    description: 'No contradictions with existing entries',
    passed: true, // Requires comparison with other entries
    message: 'Requires comparison with other entries',
    suggestion: 'Verify consistency with other entries'
  });

  // ============================================================================
  // 8. Future-Proofing
  // ============================================================================

  // 8.1 Entry can stand alone without external context
  checks.push({
    id: '8.1',
    category: 'Future-Proofing',
    description: 'Entry can stand alone without external context',
    passed: wordCountTotal > 200 && firstParagraph.length > 50,
    message: wordCountTotal < 200 ? 'Content may be too brief' : undefined,
    suggestion: 'Ensure entry is self-contained and understandable alone'
  });

  // 8.2 Easy to update without rewriting everything
  checks.push({
    id: '8.2',
    category: 'Future-Proofing',
    description: 'Easy to update without rewriting everything',
    passed: headings.length >= 3,
    message: headings.length < 3 ? 'Structure may be too flat' : undefined,
    suggestion: 'Use clear section structure for easy updates'
  });

  // 8.3 Leaves room for deeper follow-up entries
  checks.push({
    id: '8.3',
    category: 'Future-Proofing',
    description: 'Leaves room for deeper follow-up entries',
    passed: true, // Requires manual review
    message: 'Requires manual review',
    suggestion: 'Avoid covering everything - leave room for deeper dives'
  });

  // 8.4 Does not rely on AI features to be useful
  checks.push({
    id: '8.4',
    category: 'Future-Proofing',
    description: 'Does not rely on AI features to be useful',
    passed: true, // Requires manual review
    message: 'Requires manual review',
    suggestion: 'Ensure content is valuable even without AI-powered features'
  });

  const passed = checks.filter(c => c.passed).length;
  const total = checks.length;
  const score = Math.round((passed / total) * 100);

  return {
    slug: script.slug,
    title: meta.title,
    checks,
    score,
    passed,
    total
  };
}
