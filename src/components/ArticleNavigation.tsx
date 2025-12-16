import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPreviousScript, getNextScript } from '../lib/content';

interface ArticleNavigationProps {
  currentSlug: string;
}

export function ArticleNavigation({ currentSlug }: ArticleNavigationProps) {
  const previous = getPreviousScript(currentSlug);
  const next = getNextScript(currentSlug);

  if (!previous && !next) return null;

  return (
    <nav className="article-navigation" aria-label="Article navigation">
      {previous ? (
        <Link to={`/scripts/${previous.slug}`} className="nav-link nav-prev">
          <ChevronLeft size={20} aria-hidden="true" />
          <div>
            <span className="nav-label">Previous</span>
            <span className="nav-title">{previous.meta.title}</span>
          </div>
        </Link>
      ) : (
        <div className="nav-link nav-prev nav-disabled" />
      )}
      
      {next ? (
        <Link to={`/scripts/${next.slug}`} className="nav-link nav-next">
          <div>
            <span className="nav-label">Next</span>
            <span className="nav-title">{next.meta.title}</span>
          </div>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      ) : (
        <div className="nav-link nav-next nav-disabled" />
      )}
    </nav>
  );
}
