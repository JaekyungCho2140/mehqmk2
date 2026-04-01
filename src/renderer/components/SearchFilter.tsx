import { useState, useEffect } from 'react';

interface SearchFilterProps {
  readonly onSearch: (text: string) => void;
  readonly debounceMs?: number;
}

export function SearchFilter({
  onSearch,
  debounceMs = 300,
}: SearchFilterProps): React.ReactElement {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  return (
    <input
      className="text-input search-filter-input"
      placeholder="프로젝트 검색..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      data-testid="dashboard-search-filter"
    />
  );
}
