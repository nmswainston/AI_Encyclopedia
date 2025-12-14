---
title: "Embeddings in Plain English"
summary: "What embeddings are, why they work, and how to use them for search and matching."
level: "beginner"
minutes: 9
tags: ["nlp", "fundamentals", "vector-search"]
date: "2025-12-14"
status: "published"
---

## What is an embedding?
An embedding is a way to turn text (or images) into numbers that preserve meaning.

Instead of storing a sentence as words, we store it as a vector: a long list of numbers.
Similar meanings end up near each other in that number space.

## Why do embeddings matter?
Because computers are good at comparing numbers.

If you embed:
- "How do I reset my router?"
and
- "Steps to reboot a modem"

Those embeddings will be close, even though the words are different.

That means you can build:
- semantic search (search by meaning)
- recommendations (similar items)
- clustering (group related content)
- deduping (find near-duplicates)

## The only concept you need
Distance.

If two embeddings are close, they are similar.
If they are far, they are different.

Most systems use cosine similarity (angle between vectors), but you do not need to obsess over it.

## Common pitfalls
### 1) Wrong chunk size
If you embed huge documents, similarity gets mushy.
Chunk content into sections (often 200 to 800 tokens).

### 2) Garbage in, garbage out
If your text includes menus, footers, or repeated boilerplate, your search results will be noisy.

### 3) No metadata filters
Embeddings find “similar,” not “correct.”
Always add filters like category, date, or product line when possible.

## Quick use case: search your scripts library
Embed each script chunk and store:
- embedding vector
- title
- tags
- URL

When user searches, embed the query and return the nearest matches.
That is semantic search.

## Practical takeaway
Embeddings are a meaning-preserving coordinate system.
They let you do “find the closest concept” instead of “match the exact words.”
