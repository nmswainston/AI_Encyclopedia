---
title: "Tokens and Tokenization (Why Words Aren’t Words)"
summary: "What tokens actually are, why models don’t see words, and how tokenization explains context limits, costs, and weird behavior."
level: "beginner"
minutes: 11
tags: ["tokens", "tokenization", "llm", "fundamentals", "math-lite"]
date: "2025-12-14"
status: "published"
---

## What this is
Large language models do not see words.

They see **tokens**.

A token is a chunk of text the model treats as a unit. Sometimes it is a full word. Sometimes it is part of a word. Sometimes it is punctuation, whitespace, or a weird fragment that looks meaningless to humans.

The model predicts one token at a time. Everything else builds on that.

## Why it exists
Computers need a fixed vocabulary of symbols to work with.

Human language is messy:
- new words appear
- spelling varies
- languages mix
- words can be arbitrarily long

Tokenization exists to break raw text into manageable pieces so the model can operate on them reliably.

It is an engineering compromise, not a linguistic truth.

## The technician mental model
Think of packetization in networking.

Applications send streams of data.
The network breaks that stream into packets.
Packets are routed, reassembled, and processed.

Tokens are packets for language.

The model does not care about “words”.
It cares about packets that fit its internal system.

## What a token actually looks like
A single word may be:
- one token
- multiple tokens
- or part of a token

For example:
- “cat” might be one token
- “networking” might split into multiple pieces
- rare or technical terms often get fragmented

That fragmentation matters more than most people expect.

## Why tokenization affects behavior
Tokenization explains a lot of odd model behavior.

### Context limits
The model has a maximum number of tokens it can see at once.

Long conversations fill the window faster than expected because:
- punctuation counts
- whitespace counts
- long words may be multiple tokens

This is why models “forget” earlier parts of a conversation.

### Cost and latency
Most APIs bill by token count.

More tokens:
- cost more
- take longer to process
- reduce available context space

Efficient prompts are not just nice. They are cheaper and more reliable.

### Spelling and formatting weirdness
The model is predicting tokens, not characters.

That is why it can:
- spell a word correctly in one context
- mess it up in another
- struggle with character-by-character tasks

You are seeing token boundaries leak through.

## Tokens vs meaning
Tokens are not semantic units.

Meaning emerges from:
- token embeddings
- attention across many tokens
- patterns learned during training

A single token does not “mean” something on its own.
Meaning is distributed across sequences.

## Why prompts break in subtle ways
Small wording changes can cause large output changes.

Why?
Because you crossed a token boundary.

Rephrasing can:
- change token splits
- alter probabilities
- shift which continuation becomes most likely

This is why prompt engineering feels fragile until you understand tokens.

## Common myths
**“The model reads words like humans do.”**  
It does not. Words are a human abstraction layered on top.

**“Shorter text always means fewer tokens.”**  
Not necessarily. Tokenization can surprise you.

**“Tokens are just characters.”**  
No. They are learned text fragments optimized for compression and frequency.

## Debug checklist (print this in your brain)
- Is your prompt longer than you think in tokens?
- Are technical or rare words being fragmented?
- Is context being lost due to window limits?
- Would rephrasing reduce token count?
- Are costs or latency higher than expected?

## Practical takeaway
Tokens are the atomic units of language for models.

They explain:
- context window limits
- pricing models
- prompt fragility
- memory loss
- spelling oddities

If an LLM feels strange, the reason is often hiding at the token level.

Embeddings explain how tokens get meaning.  
Inference explains how tokens are predicted.  
Tokenization explains why words aren’t words.
