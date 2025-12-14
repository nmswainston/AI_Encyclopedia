import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { getScriptBySlug } from '../lib/content';
import type { LearningPath } from '../lib/learningPaths';

interface LearningPathCardProps {
  path: LearningPath;
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  const scripts = path.slugOrder
    .map(slug => getScriptBySlug(slug))
    .filter(script => script !== undefined);

  return (
    <div className="learning-path-card">
      <div className="learning-path-header">
        <BookOpen size={24} />
        <div>
          <h3>{path.title}</h3>
          <p className="learning-path-description">{path.description}</p>
        </div>
      </div>
      
      <div className="learning-path-meta">
        <span className={`learning-path-level badge-level-${path.level}`}>
          {path.level}
        </span>
        <span className="learning-path-time">
          <Clock size={14} />
          {path.estimatedTime} min
        </span>
      </div>

      <div className="learning-path-steps">
        <h4>Learning Path:</h4>
        <ol>
          {scripts.map((script, index) => (
            <li key={script.slug}>
              <Link to={`/scripts/${script.slug}`}>
                {index + 1}. {script.meta.title}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {scripts.length > 0 && (
        <Link 
          to={`/scripts/${scripts[0].slug}`}
          className="learning-path-start-button"
        >
          Start Learning Path
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
