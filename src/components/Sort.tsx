import { Fragment } from 'react';

interface SortProps {
  sortOptions: string[];
  sort: string;
  onSortChange: (selectedSort: string) => void;
}

export default function Sort({ sortOptions, sort, onSortChange }: SortProps) {
  const changeSort = (selectedSort: string) => {
    onSortChange(selectedSort);
  };

  return (
    <>
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
