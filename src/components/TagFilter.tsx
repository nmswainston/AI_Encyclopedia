interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagToggle }: TagFilterProps) {
  return (
    <div className="tag-filter">
      <div className="tag-filter-header">
        <h3>Tags</h3>
      </div>
      <div className="tag-list custom-scrollbar">
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
