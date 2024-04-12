import { useSearchParams } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';

interface SearchProps {
  onSearchSubmit: (search: string) => void;
}

export default function Search({ onSearchSubmit }: SearchProps) {
  const params = useSearchParams();

  // controls form state
  const [search, setSearch] = useState<string>(params?.get('search') || '');

  // displays the search term, should update after input is submitted
  const [displaySearch, setDisplaySearch] = useState<string>(
    params?.get('search') || ''
  );

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    setDisplaySearch(search);
    onSearchSubmit(search);
  };

  const clearSearch = () => {
    setSearch(''); // clear form input
    setDisplaySearch(''); // clear search term display

    // invoke submit with empty string to clear param and re-fetch data
    onSearchSubmit('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search">Search</label>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="search products"
          onChange={(evt) => setSearch(evt.target.value)}
        />
        <input
          type="submit"
          value="Search"
          disabled={search === '' ? true : false}
        />
      </form>
      {displaySearch && (
        <div>
          <p>Search Term: {displaySearch}</p>
          <button onClick={clearSearch}>Clear Search</button>
        </div>
      )}
    </div>
  );
}
