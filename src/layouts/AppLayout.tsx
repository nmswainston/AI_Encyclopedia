import { Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { getScriptBySlug } from '../lib/content';
import { BookOpen } from 'lucide-react';

export function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isScriptDetail = location.pathname.startsWith('/scripts/');
  const isLearningPaths = location.pathname === '/learning-paths';
  
  // Determine container class based on route
  const containerClass = isHome ? 'library-page' : isScriptDetail ? 'script-detail' : isLearningPaths ? 'learning-paths-page' : '';

  // Update meta tags for SEO
  useEffect(() => {
    if (isScriptDetail) {
      const slug = location.pathname.split('/scripts/')[1];
      const script = slug ? getScriptBySlug(slug) : undefined;
      
      if (script) {
        // Update meta tags
        document.title = `${script.meta.title} | AI Encyclopedia`;
        
        // Update or create meta description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', script.meta.summary);

        // Update Open Graph tags
        const updateOGTag = (property: string, content: string) => {
          let tag = document.querySelector(`meta[property="${property}"]`);
          if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            document.head.appendChild(tag);
          }
          tag.setAttribute('content', content);
        };

        updateOGTag('og:title', script.meta.title);
        updateOGTag('og:description', script.meta.summary);
        updateOGTag('og:type', 'article');
        updateOGTag('og:url', window.location.href);
        if (script.meta.image) {
          updateOGTag('og:image', script.meta.image);
        }
      }
    } else {
      document.title = 'AI Encyclopedia | Comprehensive AI Learning Resources';
    }
  }, [location, isScriptDetail]);

  return (
    <div className={containerClass}>
      <div className="app-header">
        <div className="app-header-left">
          {isHome ? (
            <Link to="/" className="app-logo">
              <h1>AI Encyclopedia</h1>
            </Link>
          ) : (
            <Link to="/" className="back-link">Back to Library</Link>
          )}
          <nav className="app-nav">
            <Link to="/" className={isHome ? 'active' : ''}>Articles</Link>
            <Link to="/learning-paths" className={isLearningPaths ? 'active' : ''}>
              <BookOpen size={16} />
              Learning Paths
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  );
}