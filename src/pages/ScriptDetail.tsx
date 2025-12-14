import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getScriptBySlug } from '../lib/content';
import { addToHistory } from '../lib/storage';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { TableOfContents } from '../components/TableOfContents';
import { RelatedArticles } from '../components/RelatedArticles';
import { ReadingProgress } from '../components/ReadingProgress';
import { BookmarkButton } from '../components/BookmarkButton';
import { ShareButtons } from '../components/ShareButtons';
import { ArticleNavigation } from '../components/ArticleNavigation';
import { ReadingControls } from '../components/ReadingControls';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { Clock, Calendar, User, Edit } from 'lucide-react';

export function ScriptDetail() {
  const { slug } = useParams<{ slug: string }>();
  const script = slug ? getScriptBySlug(slug) : undefined;
  const [readingMode, setReadingMode] = useState(false);
  const readingModeRef = useRef(false);

  useEffect(() => {
    if (script && slug) {
      addToHistory(slug, script.meta.title);
      // Update document title for SEO
      document.title = `${script.meta.title} | AI Encyclopedia`;
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

  const handleReadingModeChange = (enabled: boolean) => {
    readingModeRef.current = enabled;
    setReadingMode(enabled);
  };

  const handleReadingModeToggle = () => {
    // Trigger the ReadingControls to toggle
    const readingModeButton = document.querySelector('.reading-mode-button') as HTMLButtonElement;
    if (readingModeButton) {
      readingModeButton.click();
    }
  };

  return (
    <>
      <KeyboardShortcuts onReadingModeToggle={handleReadingModeToggle} />
      <ReadingProgress />
      <div className={`script-detail-page ${readingMode ? 'reading-mode' : ''}`}>
        <Breadcrumbs script={script} />
        
        <article className="script-article">
          <header className="script-header">
            <div className="script-header-top">
              <h1>{script.meta.title}</h1>
              <div className="script-actions">
                <BookmarkButton slug={script.slug} />
                <ReadingControls onReadingModeChange={handleReadingModeChange} />
              </div>
            </div>
            
            <div className="script-meta-detail">
              <span className={`script-level badge-level-${script.meta.level}`}>
                {script.meta.level}
              </span>
              <span className="script-minutes">
                <Clock size={14} />
                {script.meta.minutes} min
              </span>
              <span className="script-date">
                <Calendar size={14} />
                {script.meta.date}
              </span>
              {script.meta.lastUpdated && (
                <span className="script-updated">
                  <Edit size={14} />
                  Updated {script.meta.lastUpdated}
                </span>
              )}
              {script.meta.author && (
                <span className="script-author">
                  <User size={14} />
                  {script.meta.author}
                </span>
              )}
            </div>
            
            <div className="script-tags">
              {script.meta.tags.map(tag => (
                <span key={tag} className={`tag tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}>{tag}</span>
              ))}
            </div>
            
            <p className="script-summary-detail">{script.meta.summary}</p>
            
            <ShareButtons 
              url={`/scripts/${script.slug}`}
              title={script.meta.title}
              summary={script.meta.summary}
            />
          </header>

          <div className="script-content-wrapper">
            <aside className="script-sidebar">
              <TableOfContents content={script.content} />
            </aside>
            
            <div className="script-content">
              {script.meta.prerequisites && script.meta.prerequisites.length > 0 && (
                <div className="prerequisites-box">
                  <h3>Prerequisites</h3>
                  <ul>
                    {script.meta.prerequisites.map((prereq, idx) => {
                      const prereqScript = getScriptBySlug(prereq);
                      return (
                        <li key={idx}>
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

