import React, { useState } from 'react';
import { ChevronDown, Loader  } from 'lucide-react';
import type { Version } from '../types/Version';

const VersionSelector: React.FC<{
  versions: Version[];
  currentVersion: string;
  onVersionChange: (version: string) => void;
  loading: boolean;
}> = ({ versions, currentVersion, onVersionChange, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = versions.find(v => v.version === currentVersion);

  if (loading) {
    return (
      <div className="px-3 py-2 bg-gray-100 rounded-md">
        <div className="flex items-center gap-2">
          <Loader className="w-4 h-4 animate-spin" />
          <span className="text-sm text-gray-600">Loading versions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        disabled={versions.length === 0}
      >
        <span className="font-medium">{current?.label || 'Select Version'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && versions.length > 0 && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-full">
          {versions.map((version) => (
            <button
              key={version.version}
              onClick={() => {
                onVersionChange(version.version);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
            >
              {version.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionSelector;
