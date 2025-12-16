---
title: "What an LLM Is Actually Doing When It Responds"
summary: "A clear mental model for what large language models do at inference time, and why it feels like thinking even when it isn’t."
level: "beginner"
minutes: 13
tags: ["llm", "fundamentals", "inference", "mental-models", "math-lite"]
date: "2025-12-14"
status: "published"
---

## What this is
When a large language model responds, it is not thinking, reasoning, or recalling facts.

It is predicting the next token.

Over and over.

Given everything it has seen so far in the conversation, the model estimates which next token is most likely to follow, based on patterns learned during training.

That is the entire operation.

## Why it exists
Language is sequential. Each word depends on the ones before it.

LLMs exist to model that sequence at scale by learning:
- which words tend to follow which
- in what contexts
- with what structure

During training, the model learns these patterns.
During use, it applies them.

There is no lookup table. There is no search engine. There is no inner narrator.

## The technician mental model
Think of a very advanced autocomplete system.

Not the cheap kind that finishes your sentence with nonsense, but one trained on a massive corpus of human writing.

You give it context.
It predicts the most likely next piece.
That prediction becomes part of the context.
Repeat.

It is like a signal chain that continuously feeds its own output back into the input.

Forward pass. Append token. Forward pass again.

Smooth, fast, and entirely mechanical.

## What the model actually has access to
At response time, the model only sees:
- the current prompt
- the conversation history within the context window
- its learned parameters (weights)

It does not:
- browse the internet
- remember past conversations
- check facts
- know whether it is right or wrong

If information is not in the prompt or encoded statistically in its weights, it does not exist to the model.

## Tokens, not words
The model does not see words. It sees tokens.

A token might be:
- a word
- part of a word
- punctuation
- whitespace

The model predicts one token at a time based on probabilities.

That is why responses can feel coherent at the sentence level while still drifting subtly off course over longer outputs.

## Why it feels like thinking
Humans are extremely good at projecting intent.

The model:
- uses correct grammar
- follows logical structure
- mirrors reasoning patterns it has seen

So our brains fill in the gaps and assume understanding.

But the model is not reasoning forward from principles.
It is continuing a pattern that looks like reasoning.

This distinction matters.

## Where embeddings and attention fit
Internally, the model:
- converts tokens into embeddings
- uses attention to weigh which parts of the context matter most
- produces probability distributions for the next token

It is not manipulating ideas.
It is manipulating representations.

The coherence emerges statistically.

## Why responses can change
Ask the same question twice and get different answers.

That is not mood or creativity.
It is probability.

Small randomness, temperature settings, or prompt changes shift which high-probability path the model follows.

Once it commits to a path, it stays consistent within that response.

## Common myths
**“The model is reasoning step by step.”**  
It may produce text that looks like reasoning, but it is pattern continuation.

**“The model knows when it is unsure.”**  
It does not. Confidence is a tone, not a signal.

**“The model remembers me.”**  
It does not. Memory must be provided explicitly.

## Debug checklist (print this in your brain)
- Is the needed information actually in the prompt?
- Is the context window too small?
- Are you asking for facts without grounding?
- Are you confusing fluent language with correctness?
- Would a clearer structure reduce ambiguity?

## Practical takeaway
An LLM response is a controlled hallucination constrained by probability and context.

It feels intelligent because it is extremely good at continuing human-like patterns.

Backpropagation explains how it learned.  
Gradient descent explains how it improved.  
Embeddings explain how meaning is represented.  
This explains what happens when you press “enter.”
