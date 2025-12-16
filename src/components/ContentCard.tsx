import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookmarkButton } from './BookmarkButton';

type AsType = 'div' | 'link';

interface ContentCardProps {
  as?: AsType;
  to?: string;
  icon?: ReactNode;
  title: ReactNode;
  /** Optional action in the header (e.g. custom button) */
  headerAction?: ReactNode;
  /** When provided, shows a standard bookmark toggle in the header */
  bookmarkSlug?: string;
  description?: ReactNode;
  meta?: ReactNode;
  tags?: ReactNode;
  /** Main card content between metadata and CTA (e.g. learning path steps) */
  children?: ReactNode;
  /** Bottom CTA area – button or inline CTA row */
  cta?: ReactNode;
  className?: string;
}

export function ContentCard({
  as = 'div',
  to,
  icon,
  title,
  headerAction,
  bookmarkSlug,
  description,
  meta,
  tags,
  children,
  cta,
  className = '',
}: ContentCardProps) {
  const cardContent = (
    <>
      <div className="content-card-header">
        {icon && <div className="content-card-icon">{icon}</div>}
        <div className="content-card-header-text">
          <h3 className="content-card-title">{title}</h3>
          {description && (
            <p className="content-card-description">{description}</p>
          )}
        </div>
        {(headerAction || bookmarkSlug) && (
          <div className="content-card-header-action">
            {headerAction ?? <BookmarkButton slug={bookmarkSlug!} />}
          </div>
        )}
      </div>

      {meta && <div className="content-card-meta">{meta}</div>}

      {tags && <div className="content-card-tags">{tags}</div>}

      {children && <div className="content-card-body">{children}</div>}

      {cta && <div className="content-card-cta">{cta}</div>}
    </>
  );

  if (as === 'link') {
    return (
      <Link to={to ?? '#'} className={`content-card ${className}`}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={`content-card ${className}`}>
      {cardContent}
    </div>
  );
}

