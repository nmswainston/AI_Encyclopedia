# AI Encyclopedia

A comprehensive learning resource for AI and machine learning concepts, built with React, TypeScript, and modern web technologies.

## Features

- **Content Library**: Browse and search articles about AI fundamentals, neural networks, LLMs, and more
- **Learning Paths**: Follow curated sequences of articles for structured learning
- **Dark Mode**: System-aware theme switching with manual override
- **Reading Mode**: Distraction-free reading experience with customizable font size
- **Bookmarks**: Save articles for later reading
- **Search & Filter**: Find content by tags, categories, or full-text search
- **Table of Contents**: Automatic TOC generation for articles with heading navigation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **React Markdown** for rendering markdown content with syntax highlighting
- **KaTeX** for mathematical notation
- **Zod** for schema validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run new:script` - Create a new article template
- `npm run check:quality` - Validate content quality
- `npm run check:quality:verbose` - Validate content quality with detailed output

## Project Structure

```
src/
├── components/      # React components
├── content/         # Markdown content files
│   └── scripts/     # Article markdown files
├── contexts/        # React contexts (theme)
├── layouts/         # Layout components
├── lib/             # Utilities and data management
├── pages/           # Page components
└── main.tsx         # Entry point
```

## Adding Content

### Create a New Article

```bash
npm run new:script
```

This will guide you through creating a new article with proper frontmatter.

### Article Format

Articles are markdown files with YAML frontmatter:

```yaml
---
title: "Article Title"
summary: "One sentence summary"
level: "beginner" | "intermediate" | "advanced"
minutes: 10
tags: ["tag1", "tag2"]
date: "YYYY-MM-DD"
status: "published" | "draft"
category: "Optional Category"
author: "Optional Author"
related: ["slug1", "slug2"]
prerequisites: ["slug1"]
---
```

### Content Quality

Run the quality checker to validate articles:

```bash
npm run check:quality
```

## Deployment

The app is configured for deployment on Netlify (see `netlify.toml`). The build process:

1. TypeScript compilation
2. Vite build with optimization
3. Static assets generation

Deploy the `dist` directory to your hosting provider.

## Development Notes

- Content is loaded at build time using Vite's glob imports
- LocalStorage is used for user preferences (theme, bookmarks, reading history)
- All content is validated against Zod schemas
- Markdown rendering supports GitHub Flavored Markdown, math notation (KaTeX), and syntax highlighting

## License

Private project - all rights reserved.

