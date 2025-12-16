import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { getScriptBySlug } from '../lib/content';
import { addToHistory } from '../lib/storage';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { TableOfContents } from '../components/TableOfContents';
import { RelatedArticles } from '../components/RelatedArticles';
import { ReadingProgress } from '../components/ReadingProgress';
import { ShareButtons } from '../components/ShareButtons';
import { ArticleNavigation } from '../components/ArticleNavigation';
import { ReadingControls } from '../components/ReadingControls';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { Clock, Calendar, User, Edit } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export function ScriptDetail() {
  const { slug } = useParams<{ slug: string }>();
  const script = slug ? getScriptBySlug(slug) : undefined;

  useEffect(() => {
    if (script && slug) {
      addToHistory(slug, script.meta.title);
      // Note: document.title is handled by AppLayout
    }
  }, [script, slug]);

  if (!script) {
    return (
      <div className="error-state">
        <h2>Script Not Found</h2>
        <p>The script you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <>
      <KeyboardShortcuts />
      <ReadingProgress />
      <div className="script-detail-page">
        <Breadcrumbs script={script} />
        
        <article className="script-article">
          <PageHeader
            eyebrow={script.meta.category ?? 'Article'}
            title={script.meta.title}
            bookmarkSlug={script.slug}
            rightSlot={(
              <ReadingControls
              />
            )}
            meta={(
              <>
                <span className={`meta-pill script-level badge-level-${script.meta.level}`}>
                  {script.meta.level}
                </span>
                <span className="meta-pill script-minutes">
                  <Clock size={14} aria-hidden="true" />
                  {script.meta.minutes} min
                </span>
                <span className="meta-pill script-date">
                  <Calendar size={14} aria-hidden="true" />
                  {script.meta.date}
                </span>
                {script.meta.lastUpdated && (
                  <span className="meta-pill script-updated">
                    <Edit size={14} aria-hidden="true" />
                    Updated {script.meta.lastUpdated}
                  </span>
                )}
                {script.meta.author && (
                  <span className="meta-pill script-author">
                    <User size={14} aria-hidden="true" />
                    {script.meta.author}
                  </span>
                )}
              </>
            )}
          >
            <div className="script-tags">
              {script.meta.tags.map(tag => (
                <span
                  key={tag}
                  className={`tag tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="page-header-description">{script.meta.summary}</p>

            <ShareButtons
              url={`/scripts/${script.slug}`}
              title={script.meta.title}
              summary={script.meta.summary}
            />
          </PageHeader>

          <div className="script-content-wrapper">
            <aside className="script-sidebar">
              <TableOfContents content={script.content} />
            </aside>
            
            <div className="script-content">
              {script.meta.prerequisites && script.meta.prerequisites.length > 0 && (
                <div className="prerequisites-box">
                  <h3>Prerequisites</h3>
                  <ul>
                    {script.meta.prerequisites.map((prereq) => {
                      const prereqScript = getScriptBySlug(prereq);
                      return (
                        <li key={prereq}>
                          {prereqScript ? (
                            <Link to={`/scripts/${prereqScript.slug}`}>{prereqScript.meta.title}</Link>
                          ) : (
                            prereq
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              
              <MarkdownRenderer content={script.content} />
            </div>
          </div>

          <ArticleNavigation currentSlug={script.slug} />
          
          <RelatedArticles currentSlug={script.slug} />
        </article>
      </div>
    </>
  );
}

