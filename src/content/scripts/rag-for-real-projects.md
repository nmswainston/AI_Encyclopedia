---
title: "RAG for Real Projects"
summary: "A practical guide to Retrieval-Augmented Generation: what it is, when to use it, and how to avoid common traps."
level: "intermediate"
minutes: 14
tags: ["llms", "rag", "vector-search", "architecture"]
date: "2025-12-14"
status: "published"
---

## What RAG is
RAG means you retrieve relevant documents first, then ask the model to answer using those documents.

It is how you get:
- answers grounded in your data
- citations
- fewer hallucinations
- updates without retraining

## When you should use RAG
Use RAG when:
- the answer lives in your docs (policies, manuals, notes)
- information changes frequently
- you need “show your work” behavior

Do not use RAG when:
- the task is pure reasoning or creativity
- the answer is general knowledge and you trust the model

## The basic pipeline
1) Ingest documents
2) Chunk them
3) Embed chunks
4) Store in a vector database
5) At query time:
   - embed query
   - retrieve top chunks
   - send chunks + question to LLM

## Common traps and fixes
### Trap: chunks are too big
Fix: chunk by headings and keep them tight.

### Trap: retrieval is irrelevant
Fix: use metadata filters and tune topK.
Also add a reranker if needed.

### Trap: model ignores the context
Fix: instruct it clearly:
"Answer only using the provided context. If missing, say you do not know."

### Trap: mixed sources
Fix: separate indexes by source or version.

## Practical takeaway
RAG is not a single feature.
It is an information plumbing system.
If your plumbing is sloppy, the model will drink from the wrong pipe.
