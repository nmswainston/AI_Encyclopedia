# Knowledgebase Entry Quality Checklist

This document outlines the quality standards for all knowledgebase entries in the AI Encyclopedia.

## Usage

### Command Line

Check all entries:
```bash
npm run check:quality
```

Check a specific entry:
```bash
npm run check:quality embeddings-in-plain-english
```

Verbose output (shows all checks, not just failures):
```bash
npm run check:quality --verbose
```

### Programmatic Usage

```typescript
import { checkQuality, checkAllQuality } from './src/lib/qualityChecker';
import { getAllScripts } from './src/lib/content';

const scripts = getAllScripts();
const reports = checkAllQuality(scripts);
```

## Checklist Categories

### 1. Intent & Audience

- ✅ **Title clearly states what and who it's for**  
  Title should be descriptive and indicate the target audience.

- ✅ **Summary explains the value in one sentence**  
  Summary should be 20-200 characters and clearly state the value proposition.

- ✅ **Audience or prerequisites explicitly stated**  
  Either use the `prerequisites` field in frontmatter or mention target audience in content.

- ✅ **Level matches actual complexity**  
  Level (beginner/intermediate/advanced) should accurately reflect content complexity.

### 2. Scope & Boundaries

- ✅ **Opening defines what the concept is**  
  First paragraph should clearly define the concept using phrases like "X is..." or "X refers to...".

- ✅ **Opening briefly states what it is not**  
  Help readers understand boundaries by clarifying what the concept is NOT.

- ✅ **Mental models are labeled as abstractions**  
  When using analogies, explicitly label them (e.g., "Think of it as...", "This is a simplified model...").

- ✅ **Article avoids drifting into adjacent topics**  
  Stay focused on the main topic without excessive tangents.

### 3. Structure & Flow

- ✅ **Clear conceptual explanation before details**  
  Start with overview/introduction before diving into specifics.

- ✅ **Sections follow a consistent order**  
  Use consistent section ordering across entries.

- ✅ **Headings are descriptive, not clever**  
  Use clear, descriptive headings that state what the section covers.

- ✅ **Ending reinforces the core idea without adding new ones**  
  End with a clear takeaway that reinforces the main concept.

### 4. Concept Connections

- ✅ **Key terms are linked to other entries**  
  Use markdown links to connect related concepts.

- ✅ **Related concepts are acknowledged**  
  Either use the `related` field in frontmatter or mention related concepts in content.

- ✅ **"Related concepts" section exists**  
  Include a section or frontmatter field listing related entries.

- ✅ **No orphan concepts mentioned without context**  
  All mentioned concepts should be either explained or linked.

### 5. Technical Discipline

- ✅ **Math is introduced only when necessary**  
  Only include mathematical notation if essential to understanding.

- ✅ **Each technical term is defined on first use**  
  Define technical terms when first introduced.

- ✅ **Formulas are explained conceptually, not just shown**  
  Always explain what formulas mean, not just display them.

- ✅ **Warnings or limitations are stated where relevant**  
  Include warnings, limitations, or common pitfalls where applicable.

### 6. Practical Value

- ✅ **Includes real-world symptoms or failure modes**  
  Include real-world problems, errors, or failure modes.

- ✅ **Fixes are actionable and concise**  
  Provide actionable, step-by-step guidance where applicable.

- ✅ **Checklist or diagnostic guidance included where appropriate**  
  Add checklists or diagnostic steps where helpful.

- ✅ **Advice aligns with how practitioners actually work**  
  Ensure advice matches real-world practice.

### 7. Consistency & Trust Signals

- ✅ **Tone matches other entries**  
  Maintain consistent tone across all entries.

- ✅ **Front matter fields are complete and accurate**  
  Ensure all required frontmatter fields are present and correct.

- ✅ **Dates or "last updated" info present**  
  Include `date` or `lastUpdated` field in frontmatter.

- ✅ **No contradictions with existing entries**  
  Verify consistency with other entries.

### 8. Future-Proofing

- ✅ **Entry can stand alone without external context**  
  Ensure entry is self-contained and understandable alone (minimum 200 words).

- ✅ **Easy to update without rewriting everything**  
  Use clear section structure for easy updates.

- ✅ **Leaves room for deeper follow-up entries**  
  Avoid covering everything - leave room for deeper dives.

- ✅ **Does not rely on AI features to be useful**  
  Ensure content is valuable even without AI-powered features.

## Scoring

Each entry receives a score based on how many checks pass:
- **90-100%**: Excellent - ready for publication
- **75-89%**: Good - minor improvements recommended
- **60-74%**: Needs work - several improvements needed
- **Below 60%**: Requires significant revision

## Frontmatter Fields

Required fields:
- `title`: Entry title
- `summary`: One-sentence summary
- `level`: `beginner`, `intermediate`, or `advanced`
- `minutes`: Estimated reading time
- `tags`: Array of tags
- `date`: Publication date (YYYY-MM-DD)
- `status`: `draft` or `published`

Optional fields that improve quality:
- `prerequisites`: Array of prerequisite entry slugs
- `related`: Array of related entry slugs
- `lastUpdated`: Last update date
- `category`: Category name
- `author`: Author name

## Tips for High Scores

1. **Start with definition**: Always begin by clearly defining what the concept is.

2. **Link liberally**: Link to related entries whenever you mention key concepts.

3. **Include practical examples**: Real-world scenarios help readers understand.

4. **Acknowledge limitations**: Be honest about what the concept doesn't do or when it doesn't apply.

5. **End with takeaway**: Reinforce the core idea in the conclusion.

6. **Use structured sections**: Consistent headings make entries easier to scan and update.

7. **Define terms**: When introducing technical terms, define them immediately.

8. **Add warnings**: If there are common pitfalls, include a "Common mistakes" or "Pitfalls" section.
