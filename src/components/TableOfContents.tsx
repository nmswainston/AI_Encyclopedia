import { useEffect, useState, useMemo } from 'react';
import { Hash } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  // Extract headings from content using useMemo to avoid re-renders
  const headings = useMemo<Heading[]>(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    
    return matches.map((match) => {
      const level = match[1].length;
      const text = match[2].trim();
      // Generate ID from text
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      return { id, text, level };
    });
  }, [content]);

  const [activeId, setActiveId] = useState<string>('');

  // Reset activeId when content changes (i.e., when navigating to a new page)
  useEffect(() => {
    // When navigating to a new page, reset to first heading to highlight top of TOC
    if (headings.length > 0) {
      // Small delay to ensure scroll has completed
      const timeoutId = setTimeout(() => {
        // Check if we're at the top of the page
        if (window.scrollY < 100) {
          setActiveId(headings[0].id);
        } else {
          setActiveId('');
        }
      }, 150);
      return () => clearTimeout(timeoutId);
    } else {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setActiveId('');
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [headings]);

  // Set up intersection observer when headings change
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%' }
    );

    // Track observed elements for proper cleanup
    const observedElements: Element[] = [];

    // Observe all headings - use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.observe(element);
          observedElements.push(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      // Only unobserve elements that were actually observed
      observedElements.forEach((element) => {
        observer.unobserve(element);
      });
      observer.disconnect();
    };
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  return (
    <nav className="table-of-contents" aria-label="Table of contents">
      <div className="toc-header">
        <Hash size={18} aria-hidden="true" />
        <h3>Table of Contents</h3>
      </div>
      <ul className="toc-list">
        {headings.map((heading, index) => (
          <li
            key={index}
            className={`toc-item toc-level-${heading.level} ${activeId === heading.id ? 'active' : ''}`}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(heading.id);
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
