import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Search, Bookmark } from 'lucide-react';
import { ScriptCard } from '../components/ScriptCard';
import { TagFilter } from '../components/TagFilter';
import { CategoryFilter } from '../components/CategoryFilter';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { PageHeader } from '../components/PageHeader';
import { searchScripts, getAllCategories, getAllScripts } from '../lib/content';
import { getBookmarks, getHistory } from '../lib/storage';

export function Library() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('q') || '';
  });
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    const tagsParam = searchParams.get('tags');
    return tagsParam ? tagsParam.split(',').filter(Boolean) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(() => {
    return searchParams.get('category') || null;
  });
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  // getAllScripts() returns the same array reference (module-level const)
  const allScripts = getAllScripts();

  // Get all unique tags - memoized for performance
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allScripts.forEach(script => {
      script.meta.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allScripts]);

  // getAllCategories() is computed from the same const array, so no memoization needed
  const allCategories = getAllCategories();

  // Filter scripts based on search, tags, and category
  const filteredScripts = useMemo(() => {
    let scripts = allScripts;

    // Full-text search
    if (searchQuery) {
      scripts = searchScripts(searchQuery);
    }

    // Category filter
    if (selectedCategory) {
      scripts = scripts.filter(script => script.meta.category === selectedCategory);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      scripts = scripts.filter(script =>
        selectedTags.every(tag => script.meta.tags.includes(tag))
      );
    }

    // Bookmarks filter
    if (showBookmarks) {
      const bookmarks = getBookmarks();
      scripts = scripts.filter(script => bookmarks.includes(script.slug));
    }

    // Recent filter
    if (showRecent) {
      const history = getHistory();
      const recentSlugs = history.slice(0, 10).map(item => item.slug);
      scripts = scripts.filter(script => recentSlugs.includes(script.slug));
      // Sort by history order
      scripts.sort((a, b) => {
        const aIndex = recentSlugs.indexOf(a.slug);
        const bIndex = recentSlugs.indexOf(b.slug);
        return aIndex - bIndex;
      });
    }

    return scripts;
  }, [allScripts, searchQuery, selectedTags, selectedCategory, showBookmarks, showRecent]);

  // Sync state to URL params when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    if (selectedTags.length > 0) {
      params.set('tags', selectedTags.join(','));
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    
    // Only update URL if it's different to avoid loops
    const currentQ = searchParams.get('q') || '';
    const currentTags = searchParams.get('tags') || '';
    const currentCategory = searchParams.get('category') || '';
    const newQ = params.get('q') || '';
    const newTags = params.get('tags') || '';
    const newCategory = params.get('category') || '';
    
    if (currentQ !== newQ || currentTags !== newTags || currentCategory !== newCategory) {
      setSearchParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedTags, selectedCategory, setSearchParams]);

  // Sync URL params to state when they change externally (e.g., browser back/forward)
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    const urlTags = searchParams.get('tags');
    const urlTagsArray = urlTags ? urlTags.split(',').filter(Boolean) : [];
    const urlCategory = searchParams.get('category') || null;
    
    // Only update state if URL values differ from current state
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
    const tagsMatch = urlTagsArray.length === selectedTags.length && 
                     urlTagsArray.every(tag => selectedTags.includes(tag));
    if (!tagsMatch) {
      setSelectedTags(urlTagsArray);
    }
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams to avoid loops

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <KeyboardShortcuts onSearchFocus={handleFocusSearch} />
      <PageHeader
        eyebrow="Library"
        title="Articles"
        description="Search, filter, and explore AI explanations and tutorials across difficulty levels."
        rightSlot={(
          <div className="search-bar">
            <Search size={20} className="search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: searchQuery ? '3rem' : '1rem' }}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={handleClearSearch}
                aria-label="Clear search"
                type="button"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}
      >
        <div className="library-filters-row">
          <button
            className={`filter-toggle ${showBookmarks ? 'active' : ''}`}
            onClick={() => {
              setShowBookmarks(!showBookmarks);
              setShowRecent(false);
            }}
            aria-pressed={showBookmarks}
            type="button"
          >
            <Bookmark size={16} aria-hidden="true" />
            Bookmarks
          </button>
          <button
            className={`filter-toggle ${showRecent ? 'active' : ''}`}
            onClick={() => {
              setShowRecent(!showRecent);
              setShowBookmarks(false);
            }}
            aria-pressed={showRecent}
            type="button"
          >
            Recent
          </button>
        </div>
        {/* Always render to prevent layout shift - space reserved via min-height in CSS */}
        <div className="selected-tags-chips">
          {selectedTags.map(tag => (
            <span key={tag} className="tag-chip">
              {tag}
              <button
                className="tag-chip-remove"
                onClick={() => handleRemoveTag(tag)}
                aria-label={`Remove ${tag} filter`}
                type="button"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        {/* Always render to prevent layout shift - stable spacing maintained */}
        <p className="results-count">
          {filteredScripts.length > 0 && (
            <>
              {filteredScripts.length} {filteredScripts.length === 1 ? 'script' : 'scripts'} found
              {(searchQuery || selectedTags.length > 0) && ' matching your criteria'}
            </>
          )}
        </p>
      </PageHeader>

      <div className="library-content">
        <aside className="filters">
          {allCategories.length > 0 && (
            <CategoryFilter
              categories={allCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
          <TagFilter
            tags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </aside>

        <main className="scripts-grid">
          {filteredScripts.length === 0 ? (
            <p className="no-results">
              No scripts found matching your criteria.
              {(searchQuery || selectedTags.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                  className="clear-filters-btn"
                >
                  Clear filters
                </button>
              )}
            </p>
          ) : (
            filteredScripts.map(script => (
              <ScriptCard key={script.slug} script={script} searchQuery={searchQuery} />
            ))
          )}
        </main>
      </div>
    </>
  );
}

