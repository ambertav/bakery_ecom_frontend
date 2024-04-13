import { ChangeEvent } from 'react';

interface FilterProps {
  filterOptions: string[];
  filter: string;
  label: string;
  id: string;
  onFilterChange: (filterParam: string) => void;
}

export default function Filter({
  filterOptions,
  filter,
  label,
  id,
  onFilterChange,
}: FilterProps) {
  const changeFilter = (filterParam: string) => {
    // format param to lowercase
    // if spaces, replace with underscores for visual aid and use in backend
    onFilterChange(filterParam.toLowerCase().replace(/\s+/g, '_'));
  };

  return (
    <>
      <div>
        Filter
        <div>
          <div key={id}>
            <label htmlFor={id}>Filter by {label}</label>
            <select
              id={id}
              name={id}
              value={filter}
              onChange={(evt: ChangeEvent<HTMLSelectElement>) =>
                changeFilter(evt.target.value)
              }
            >
              <option value="">Select a {label.toLowerCase()}</option>
              {filterOptions.map((opt, index) => (
                <option key={index} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
