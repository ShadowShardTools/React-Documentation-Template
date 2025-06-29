import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import GithubButtonLink from '../../components/GithubButtonLink';
import VersionSelector from '../../components/VersionSelector';
import SearchBar from '../../components/SearchBar';
import type { HeaderProps } from '../../types/props/HeaderProps';

const Header: React.FC<HeaderProps> = ({
  versions,
  currentVersion,
  onVersionChange,
  loading,
  onSearchOpen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-gray-200 transition-colors">
      <div className="flex justify-between items-center h-16 px-4">
        <Logo />
        <div className="flex items-center space-x-4">
          {/* Desktop */}
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

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            title="Toggle menu"
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
