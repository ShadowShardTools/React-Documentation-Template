//src/components/Header/Header.tsx
import { useState } from 'react';
import { Menu, Printer, X } from 'lucide-react';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import GithubButtonLink from '../../components/GithubButtonLink';
import VersionSelector from '../../components/VersionSelector';
import type { Version } from '../../types/Version';
import SearchBar from '../../components/SearchBar';

const Header: React.FC<{
  versions: Version[];
  currentVersion: string;
  onVersionChange: (version: string) => void;
  loading: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}> = ({ versions, currentVersion, onVersionChange, loading, searchTerm, onSearchChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="bg-white sticky top-0 z-50 w-full border-b-2 border-gray-200 transition-colors duration-300">
      <div className="flex justify-between h-16 items-center">
        <Logo />
        <div className="flex items-center space-x-4">
          {/* Desktop only */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
            <VersionSelector
              versions={versions}
              currentVersion={currentVersion}
              onVersionChange={onVersionChange}
              loading={loading}
            />
            <a
              href={`/print/${currentVersion}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
              title="Print all documentation"
            >
              <Printer className="w-5 h-5" />
            </a>

            <GithubButtonLink />
          </div>

          {/* Always visible (mobile toggle) */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Menu Toggle"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>
      {isMenuOpen && (
        <MobileMenu
          versions={versions}
          currentVersion={currentVersion}
          onVersionChange={onVersionChange}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
        />
      )}

    </header>
  );
};

export default Header;
