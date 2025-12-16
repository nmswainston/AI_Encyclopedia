import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcutsProps {
  onSearchFocus?: () => void;
}

export function KeyboardShortcuts({ onSearchFocus }: KeyboardShortcutsProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Cmd/Ctrl + K: Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (onSearchFocus) {
          onSearchFocus();
        }
      }

      // Escape: Go back or clear search
      if (e.key === 'Escape') {
        if (window.location.pathname !== '/') {
          navigate('/');
        }
      }

      // Cmd/Ctrl + B: Toggle bookmark (when on article page)
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        const bookmarkButton = document.querySelector('.bookmark-button') as HTMLButtonElement;
        if (bookmarkButton) {
          e.preventDefault();
          bookmarkButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onSearchFocus]);

  return null;
}
