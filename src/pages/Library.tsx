import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X, Search, Bookmark, Filter } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);

  // getAllScripts() returns the same array reference (module-level const)
  const allScripts = getAllScripts();

  // Get all unique tags - memoized since allScripts is stable
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allScripts.forEach(script => {
      script.meta.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allScripts]);

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

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedCategory(null);
    setShowBookmarks(false);
    setShowRecent(false);
  };

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedCategory || showBookmarks || showRecent;

  return (
    <>
      <KeyboardShortcuts onSearchFocus={handleFocusSearch} />
      <PageHeader
        eyebrow="Library"
        title="Articles"
        description="Browse clear explanations, filter by topic, and save what you want to revisit."
        rightSlot={(
          <div className="search-bar">
            <Search size={20} className="search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchQuery ? 'search-bar-input-with-clear' : ''}
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
        <div className="library-header-controls">
          <div className="library-pills-row">
            <button
              className={`library-pill ${showBookmarks ? 'active' : ''}`}
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
              className={`library-pill ${showRecent ? 'active' : ''}`}
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
          {filteredScripts.length > 0 && (
            <p className="results-count">
              {filteredScripts.length} {filteredScripts.length === 1 ? 'article' : 'articles'} found
            </p>
          )}
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
      </PageHeader>

      <div className="library-content">
        <button
          className="filters-toggle-mobile"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
          type="button"
        >
          <Filter size={18} aria-hidden="true" />
          Filters
          {hasActiveFilters && <span className="filters-badge">{selectedTags.length + (selectedCategory ? 1 : 0) + (showBookmarks ? 1 : 0) + (showRecent ? 1 : 0)}</span>}
        </button>
        {showFilters && (
          <div className="filters-backdrop" onClick={() => setShowFilters(false)} aria-hidden="true" />
        )}
        <aside className={`filters ${showFilters ? 'filters-open' : ''}`}>
          <div className="filters-header">
            <h3 className="filters-title">Filter by topic</h3>
            <div className="filters-header-actions">
              {hasActiveFilters && (
                <button
                  className="filters-clear-all"
                  onClick={handleClearAllFilters}
                  aria-label="Clear all filters"
                  type="button"
                >
                  Clear filters
                </button>
              )}
              <button
                className="filters-close-mobile"
                onClick={() => setShowFilters(false)}
                aria-label="Close filters"
                type="button"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
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

        <section className="scripts-grid" aria-label="Articles">
          {filteredScripts.length === 0 ? (
            <p className="no-results">
              No articles found matching your criteria.
              {hasActiveFilters && (
                <>
                  <br />
                  <button
                    onClick={handleClearAllFilters}
                    className="clear-filters-btn clear-filters-btn-inline"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </p>
          ) : (
            filteredScripts.map(script => (
              <ScriptCard key={script.slug} script={script} searchQuery={searchQuery} />
            ))
          )}
        </section>
      </div>
    </>
  );
}

