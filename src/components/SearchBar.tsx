import { Search } from 'lucide-react';
import { memo } from 'react';
import type { SearchBarProps } from '../types/props/SearchBarProps';

const SearchBar: React.FC<SearchBarProps> = memo(({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Open search"
    title="Open search (Ctrl + K)"
    className="relative flex items-center w-64 px-3 py-2 border border-gray-300 rounded-md text-left text-sm text-gray-500 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <Search className="w-4 h-4 mr-2 text-gray-400" />
    <span className="flex-1 text-gray-500">Search...</span>
    <kbd className="ml-4 px-1.5 py-0.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded">
      Ctrl
    </kbd>
    <kbd className="ml-1 px-1.5 py-0.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded">
      K
    </kbd>
  </button>
));

export default SearchBar;
