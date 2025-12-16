import { Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { Footer } from '../components/Footer';
import { BackToTop } from '../components/BackToTop';
import { getScriptBySlug } from '../lib/content';
import { BookOpen } from 'lucide-react';

export function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isScriptDetail = location.pathname.startsWith('/scripts/');
  const isLearningPaths = location.pathname === '/learning-paths';
  
  // Determine container class based on route
  const containerClass = isHome ? 'library-page' : isScriptDetail ? 'script-detail' : isLearningPaths ? 'learning-paths-page' : '';
  const layoutClass = ['app-shell', containerClass].filter(Boolean).join(' ');

  // Update meta tags for SEO
  useEffect(() => {
    if (isScriptDetail) {
      const slug = location.pathname.split('/scripts/')[1];
      const script = slug ? getScriptBySlug(slug) : undefined;
      
      if (script) {
        // Update meta tags
        document.title = `${script.meta.title} | Signal Over Noise`;
        
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
      document.title = 'Signal Over Noise | Clear, practical explanations of how AI works';
    }
  }, [location, isScriptDetail]);

  return (
    <div className={layoutClass}>
      <main className="app-main">
        <div className="app-header">
          <div className="app-header-left">
            {isHome ? (
              <Link to="/" className="app-logo">
                <span className="typography-brand-title typography-gradient-text">Signal Over Noise</span>
                <p className="app-tagline">Clear, practical explanations of how AI works</p>
              </Link>
            ) : (
              <Link to="/" className="back-link">Back to Library</Link>
            )}
            <nav className="app-nav" aria-label="Main navigation">
              <Link to="/" className={isHome ? 'active' : ''}>Library</Link>
              <Link to="/learning-paths" className={isLearningPaths ? 'active' : ''}>
                <BookOpen size={16} aria-hidden="true" />
                Learning Paths
              </Link>
            </nav>
          </div>
          <ThemeToggle />
        </div>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}