import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRelatedScripts } from '../lib/content';

interface RelatedArticlesProps {
  currentSlug: string;
}

export function RelatedArticles({ currentSlug }: RelatedArticlesProps) {
  const related = getRelatedScripts(currentSlug, 3);

  if (related.length === 0) return null;

  return (
    <section className="related-articles">
      <h2 className="related-articles-title">
        <ArrowRight size={20} aria-hidden="true" />
        Related Articles
      </h2>
      <div className="related-articles-grid">
        {related.map((script) => (
          <Link key={script.slug} to={`/scripts/${script.slug}`} className="related-article-card">
            <h3>{script.meta.title}</h3>
            <p className="related-article-summary">{script.meta.summary}</p>
            <div className="related-article-meta">
              <span className={`meta-pill script-level badge-level-${script.meta.level}`}>
                {script.meta.level}
              </span>
              <span className="meta-pill script-minutes">{script.meta.minutes} min</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
