// LocalStorage utilities for bookmarks and reading history

const BOOKMARKS_KEY = 'ai-encyclopedia-bookmarks';
const READING_HISTORY_KEY = 'ai-encyclopedia-history';
const FONT_SIZE_KEY = 'ai-encyclopedia-font-size';
const READING_MODE_KEY = 'ai-encyclopedia-reading-mode';

export function getBookmarks(): string[] {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(slug: string): boolean {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(slug);
  const isBookmarked = index !== -1;
  
  if (isBookmarked) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(slug);
  }
  
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return !isBookmarked;
  } catch {
    return isBookmarked;
  }
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}

export function addToHistory(slug: string, title: string): void {
  try {
    const history = getHistory();
    // Remove if already exists
    const filtered = history.filter(item => item.slug !== slug);
    // Add to front
    filtered.unshift({ slug, title, timestamp: Date.now() });
    // Keep only last 50
    const limited = filtered.slice(0, 50);
    localStorage.setItem(READING_HISTORY_KEY, JSON.stringify(limited));
  } catch {
    // Ignore errors
  }
}

export function getHistory(): Array<{ slug: string; title: string; timestamp: number }> {
  try {
    const stored = localStorage.getItem(READING_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(READING_HISTORY_KEY);
  } catch {
    // Ignore errors
  }
}

export function getFontSize(): number {
  try {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    return stored ? parseInt(stored, 10) : 16;
  } catch {
    return 16;
  }
}

export function setFontSize(size: number): void {
  try {
    localStorage.setItem(FONT_SIZE_KEY, size.toString());
  } catch {
    // Ignore errors
  }
}

export function getReadingMode(): boolean {
  try {
    const stored = localStorage.getItem(READING_MODE_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

export function setReadingMode(enabled: boolean): void {
  try {
    localStorage.setItem(READING_MODE_KEY, enabled.toString());
  } catch {
    // Ignore errors
  }
}
