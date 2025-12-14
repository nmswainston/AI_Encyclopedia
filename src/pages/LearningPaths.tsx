import { getAllLearningPaths } from '../lib/learningPaths';
import { LearningPathCard } from '../components/LearningPathCard';
import { BookOpen } from 'lucide-react';

export function LearningPaths() {
  const paths = getAllLearningPaths();

  return (
    <>
      <header className="learning-paths-header">
        <BookOpen size={32} />
        <div>
          <h1>Learning Paths</h1>
          <p className="learning-paths-description">
            Curated sequences of articles to guide your learning journey
          </p>
        </div>
      </header>

      <div className="learning-paths-grid">
        {paths.map(path => (
          <LearningPathCard key={path.id} path={path} />
        ))}
      </div>

      {paths.length === 0 && (
        <div className="no-learning-paths">
          <p>No learning paths available yet. Check back soon!</p>
        </div>
      )}
    </>
  );
}
