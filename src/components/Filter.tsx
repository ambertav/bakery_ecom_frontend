import { ChangeEvent } from 'react';

interface FilterProps {
  categories: string[];
  category: string;
  onFilterChange: (selectedCategory: string) => void;
}

export default function Filter({
  categories,
  category,
  onFilterChange,
}: FilterProps) {
  const changeCategory = (selectedCategory: string) => {
    onFilterChange(selectedCategory);
  };

  return (
    <>
      <div>
        Filter
        <div>
          <div key={'category'}>
            <label htmlFor={'category'}>Filter by Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(evt: ChangeEvent<HTMLSelectElement>) =>
                changeCategory(evt.target.value)
              }
            >
              <option value="">Select a category</option>
              {categories.map((c, index) => (
                <option key={index} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
