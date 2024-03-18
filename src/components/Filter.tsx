import { useRouter } from 'next/router';
import { ChangeEvent, Fragment } from 'react';

interface FilterProps {
  categories: string[];
  sortOptions: string[];
  category: string;
  sort: string;
  onFilterChange: (
    selectedCategory: string | null,
    selectedSort: string | null
  ) => void;
}

export default function Filter({
  categories,
  sortOptions,
  category,
  sort,
  onFilterChange,
}: FilterProps) {
  const router = useRouter();

  const changeCategory = (selectedCategory: string) => {
    onFilterChange(selectedCategory, null);
  };

  const changeSort = (selectedSort: string) => {
    onFilterChange(null, selectedSort);
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

      <div>
        Sort
        <div>
          {sortOptions.map((s, index) => (
            <Fragment key={index}>
              <input
                type="radio"
                name="sort"
                id={s}
                value={s}
                checked={sort === s}
                onChange={() => changeSort(s)}
              />
              <label htmlFor={s}>
                {s === 'recommended'
                  ? 'Recommended'
                  : s === 'priceAsc'
                  ? 'Price: Low to High'
                  : s === 'priceDesc'
                  ? 'Price: High to Low'
                  : s === 'nameAsc'
                  ? 'Name: A to Z'
                  : s === 'nameDesc'
                  ? 'Name: Z to A'
                  : ''}
              </label>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
