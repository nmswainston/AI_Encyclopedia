import { useState, useEffect, MouseEvent } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { toggleBookmark, isBookmarked as checkBookmarked } from '../lib/storage';

interface BookmarkButtonProps {
  slug: string;
}

export function BookmarkButton({ slug }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(checkBookmarked(slug));
  }, [slug]);

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    // Prevent parent link navigation when used inside clickable cards
    event.preventDefault();
    event.stopPropagation();

    const newState = toggleBookmark(slug);
    setBookmarked(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`bookmark-button ${bookmarked ? 'bookmark-button--active' : ''}`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      type="button"
    >
      {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
    </button>
  );
}
