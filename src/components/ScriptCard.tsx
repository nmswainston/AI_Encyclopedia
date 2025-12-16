import { ArrowRight } from 'lucide-react';
import type { Script } from '../lib/scriptSchema';
import { SearchHighlight } from './SearchHighlight';
import { ContentCard } from './ContentCard';

interface ScriptCardProps {
  script: Script;
  searchQuery?: string;
}

export function ScriptCard({ script, searchQuery = '' }: ScriptCardProps) {
  return (
    <ContentCard
      as="link"
      to={`/scripts/${script.slug}`}
      title={
        <SearchHighlight text={script.meta.title} query={searchQuery} />
      }
      description={
        <span className="script-summary">
          <SearchHighlight text={script.meta.summary} query={searchQuery} />
        </span>
      }
      bookmarkSlug={script.slug}
      meta={
        <>
          <span
            className={`meta-pill script-level badge-level-${script.meta.level}`}
          >
            {script.meta.level}
          </span>
          <span className="meta-pill script-minutes">
            {script.meta.minutes} min
          </span>
          <span className="meta-pill script-date">
            {script.meta.date}
          </span>
        </>
      }
      tags={
        <>
          {script.meta.tags.map((tag) => (
            <span
              key={tag}
              className={`tag tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {tag}
            </span>
          ))}
        </>
      }
      cta={
        <div className="content-card-cta-primary">
          <span>Read Article</span>
          <ArrowRight size={16} aria-hidden="true" />
        </div>
      }
      className="script-card"
    />
  );
}