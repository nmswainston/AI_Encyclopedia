import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const SCROLL_THRESHOLD = 250;

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsVisible(scrollY > SCROLL_THRESHOLD);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  };

  return (
    <button
      type="button"
      className={`back-to-top ${isVisible ? 'back-to-top-visible' : ''}`}
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label="Back to top"
      title="Back to top"
    >
      <ChevronUp size={20} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}

