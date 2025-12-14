
export interface LearningPath {
  id: string;
  title: string;
  description: string;
  slugOrder: string[];
  estimatedTime: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

// Define learning paths
export const learningPaths: LearningPath[] = [
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description: 'Start your AI journey with the basics',
    slugOrder: [
      'getting-started-with-ai',
      'neural-networks-explained',
      'backprop-tech'
    ],
    estimatedTime: 45,
    level: 'beginner'
  },
  {
    id: 'nlp-path',
    title: 'Natural Language Processing',
    description: 'Learn about NLP from basics to advanced concepts',
    slugOrder: [
      'natural-language-processing-basics',
      'embeddings-in-plain-english',
      'rag-for-real-projects'
    ],
    estimatedTime: 60,
    level: 'intermediate'
  },
  {
    id: 'practical-ai',
    title: 'Practical AI Applications',
    description: 'Build real-world AI applications',
    slugOrder: [
      'prompting-for-reliable-output',
      'rag-for-real-projects'
    ],
    estimatedTime: 40,
    level: 'intermediate'
  }
];

export function getLearningPathById(id: string): LearningPath | undefined {
  return learningPaths.find(path => path.id === id);
}

export function getAllLearningPaths(): LearningPath[] {
  return learningPaths;
}

export function getLearningPathsByLevel(level: string): LearningPath[] {
  return learningPaths.filter(path => path.level === level);
}
