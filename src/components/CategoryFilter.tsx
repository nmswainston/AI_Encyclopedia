import { Folder } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  if (categories.length === 0) return null;

  return (
    <div className="category-filter">
      <h3 className="filter-title">
        <Folder size={18} aria-hidden="true" />
        Categories
      </h3>
      <div className="category-list">
        <button
          className={`category-item ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onCategoryChange(null)}
          aria-pressed={selectedCategory === null}
          type="button"
        >
          All Categories
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`category-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
            aria-pressed={selectedCategory === category}
            type="button"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
