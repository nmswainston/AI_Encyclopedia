---
title: "Context Windows and Working Memory"
summary: "Why models forget things, how context limits work, and why long conversations break down."
level: "beginner"
minutes: 10
tags: ["llm", "context-window", "memory", "fundamentals"]
date: "2025-12-14"
status: "published"
---

## What this is
A context window is the maximum amount of text a model can see at one time.

Everything the model knows *during a response* must fit inside this window:
- the prompt
- the conversation history
- system instructions
- the text it has already generated

When information falls out of the window, it is gone.

## Why it exists
Models operate on fixed-size inputs.

There is no infinite memory.
There is no rolling awareness of everything that came before.

The context window is a hard constraint imposed by architecture and compute cost.

## The technician mental model
Think of RAM, not storage.

You can load files from disk, but only what fits in RAM is actively usable.
When RAM fills up, something gets evicted.

Context windows work the same way.
Old information is pushed out to make room for new tokens.

## Why models “forget”
Forgetting is not a failure.
It is eviction.

Long conversations fail because:
- token counts add up fast
- early instructions fall out of scope
- the model cannot reference what it cannot see

This is why a model may contradict itself later in a session.

## Why repetition sometimes helps
Repeating important constraints keeps them inside the context window.

You are not reminding the model.
You are reloading memory.

This is also why system prompts and summaries matter.

## Common myths
**“The model remembers earlier messages.”**  
Only if they are still in the context window.

**“More context always helps.”**  
Too much context can dilute the signal.

**“This is a bug.”**  
It is a design tradeoff.

## Debug checklist (print this in your brain)
- Is the context window already full?
- Are important instructions early and getting evicted?
- Would summarizing earlier content help?
- Are you repeating critical constraints?
- Is the task too large for one window?

## Practical takeaway
Context windows define the model’s working memory.

If something matters, it must be present *now*.

Tokens explain the limit.  
Context windows explain forgetting.