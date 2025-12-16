import { getAllLearningPaths } from '../lib/learningPaths';
import { LearningPathCard } from '../components/LearningPathCard';
import { BookOpen } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export function LearningPaths() {
  const paths = getAllLearningPaths();

  return (
    <>
      <PageHeader
        eyebrow="Programs"
        title="Learning Paths"
        description="Curated sequences of articles to guide your learning journey."
        icon={<BookOpen size={32} />}
      />

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