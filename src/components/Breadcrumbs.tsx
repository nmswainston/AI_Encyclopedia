import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import type { Script } from '../lib/scriptSchema';

interface BreadcrumbsProps {
  script?: Script;
}

export function Breadcrumbs({ script }: BreadcrumbsProps) {
  if (!script) {
    return (
      <nav className="breadcrumbs">
        <Link to="/" className="breadcrumb-item">
          <Home size={16} aria-hidden="true" />
          <span>Home</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumb-item">
        <Home size={16} aria-hidden="true" />
        <span>Home</span>
      </Link>
      {script.meta.category && (
        <>
          <ChevronRight size={16} className="breadcrumb-separator" aria-hidden="true" />
          <span className="breadcrumb-item breadcrumb-category">{script.meta.category}</span>
        </>
      )}
      <ChevronRight size={16} className="breadcrumb-separator" aria-hidden="true" />
      <span className="breadcrumb-item breadcrumb-current">{script.meta.title}</span>
    </nav>
  );
}
