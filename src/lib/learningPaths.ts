export interface LearningPath {
  id: string;
  title: string;
  description: string;
  slugOrder: string[];
  estimatedTime?: number; // optional override, otherwise auto-computed
  level: "beginner" | "intermediate" | "advanced";
}

export const learningPaths: LearningPath[] = [
  {
    id: "ai-foundations",
    title: "AI Foundations",
    description: "Understand how modern AI systems learn, improve, and represent meaning.",
    slugOrder: [
      "getting-started-with-ai",
      "neural-networks-explained",
      "backprop-tech",
      "gradient-descent-tech",
      "embeddings-tech"
    ],
    level: "beginner"
  },
  {
    id: "llm-core-systems",
    title: "How LLMs Actually Work",
    description: "Build a clear mental model of how large language models generate text and why they fail.",
    slugOrder: [
      "llm-what-its-doing-tech",
      "why-models-hallucinate-tech",
      "tokens-tokenization-tech",
      "context-windows-working-memory-tech"
    ],
    level: "beginner"
  },
  {
    id: "reliable-ai-systems",
    title: "Building Reliable AI Systems",
    description: "Learn how to control, ground, and scale LLM behavior in real applications.",
    slugOrder: [
      "prompting-instruction-design-tech",
      "rag-when-models-need-memory-tech"
    ],
    level: "intermediate"
  }
];

export function getAllLearningPaths(): LearningPath[] {
  return learningPaths;
}
