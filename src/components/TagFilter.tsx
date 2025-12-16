interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagToggle }: TagFilterProps) {
  const hasSelectedTags = selectedTags.length > 0;

  return (
    <div className="tag-filter">
      <div className="tag-filter-header">
        <h3>Filter by Tags</h3>
        {hasSelectedTags && (
          <button
            className="clear-tags-btn"
            onClick={() => {
              selectedTags.forEach(tag => onTagToggle(tag));
            }}
            aria-label="Clear all tag filters"
            title="Clear all filters"
            type="button"
          >
            Clear
          </button>
        )}
      </div>
      <div className="tag-list">
        {tags.length === 0 ? (
          <p className="no-tags">No tags available</p>
        ) : (
          tags.map(tag => (
            <label key={tag} className="tag-checkbox">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => onTagToggle(tag)}
              />
              <span>{tag}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

