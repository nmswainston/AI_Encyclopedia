import { useState, useEffect } from 'react';
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

  const handleToggle = () => {
    const newState = toggleBookmark(slug);
    setBookmarked(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className="bookmark-button"
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
    </button>
  );
}
