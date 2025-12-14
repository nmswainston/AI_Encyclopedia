import { Link } from 'react-router-dom';
import type { Script } from '../lib/scriptSchema';
import { SearchHighlight } from './SearchHighlight';

interface ScriptCardProps {
  script: Script;
  searchQuery?: string;
}

export function ScriptCard({ script, searchQuery = '' }: ScriptCardProps) {
  return (
    <Link to={`/scripts/${script.slug}`} className="script-card">
      <h3>
        <SearchHighlight text={script.meta.title} query={searchQuery} />
      </h3>
      <p className="script-summary">
        <SearchHighlight text={script.meta.summary} query={searchQuery} />
      </p>
      <div className="script-meta">
        <span className={`script-level badge-level-${script.meta.level}`}>
          {script.meta.level}
        </span>
        <span className="script-minutes">{script.meta.minutes} min</span>
        <span className="script-date">{script.meta.date}</span>
      </div>
      <div className="script-tags">
        {script.meta.tags.map(tag => (
          <span key={tag} className={`tag tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

