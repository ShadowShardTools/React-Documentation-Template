import { useState } from 'react';
import { LayoutIcon, Menu, X } from 'lucide-react';
import Logo from './Logo';
import MobileMenu from './MobileMenu';
import GithubButtonLink from '../../components/GithubLink';
import VersionSelector from '../../components/VersionSelector';
import SearchBar from '../../components/SearchBar';
import type { HeaderProps } from '../../types/props/HeaderProps';

const Header: React.FC<HeaderProps & { onSidebarToggle: () => void }> = ({
  versions,
  currentVersion,
  onVersionChange,
  loading,
  onSearchOpen,
  onSidebarToggle,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b-2 border-gray-200 transition-colors">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side: mobile menu toggle */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Center: logo */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Logo />
        </div>

        {/* Right side: sidebar toggle + desktop tools */}
        <div className="flex items-center space-x-4">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            onClick={onSidebarToggle}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <LayoutIcon className="w-6 h-6" />
          </button>

          {/* Desktop tools */}
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
