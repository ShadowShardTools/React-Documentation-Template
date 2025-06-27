//src/components/Header/Header.tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
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
  onSearchOpen: () => void;
}> = ({ versions, currentVersion, onVersionChange, loading, onSearchOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  return (
    <header className="bg-white sticky top-0 z-50 w-full border-b-2 border-gray-200 transition-colors duration-300">
      <div className="flex justify-between h-16 items-center">
        <Logo />
        <div className="flex items-center space-x-4">
          {/* Desktop only */}
          <div className="hidden md:flex items-center space-x-4">
            <SearchBar onClick={onSearchOpen} />
            <VersionSelector
              versions={versions}
              currentVersion={currentVersion}
              onVersionChange={onVersionChange}
              loading={loading}
            />
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
          onSearchOpen={onSearchOpen}
        />
      )}

    </header>
  );
};

export default Header;
