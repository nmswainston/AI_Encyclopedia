import type { ReactNode } from 'react';
import { BookmarkButton } from './BookmarkButton';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Optional metadata row directly under the title (e.g. level, time, date, author) */
  meta?: ReactNode;
  /** When provided, shows a bookmark toggle in the header */
  bookmarkSlug?: string;
  /** Right-aligned content on the primary row (e.g. search bar, view switcher) */
  rightSlot?: ReactNode;
  /** Secondary row content below the main header (e.g. tabs, filters, chips) */
  children?: ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
  meta,
  bookmarkSlug,
  rightSlot,
  children,
}: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="page-header-main">
        <div className="page-header-left">
          {icon && <div className="page-header-icon">{icon}</div>}
          <div className="page-header-text">
            {eyebrow && <div className="page-header-eyebrow">{eyebrow}</div>}
            <h1>{title}</h1>
            {description && (
              <p className="page-header-description">{description}</p>
            )}
          </div>
        </div>
        {(bookmarkSlug || rightSlot) && (
          <div className="page-header-right">
            <div className="script-actions">
              {bookmarkSlug && <BookmarkButton slug={bookmarkSlug} />}
              {rightSlot}
            </div>
          </div>
        )}
      </div>

      {meta && (
        <div className="page-header-meta">{meta}</div>
      )}

      {children && <div className="page-header-secondary">{children}</div>}
    </header>
  );
}

