const SidebarNavigationHints: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`text-xs text-gray-500 mt-2 flex flex-wrap gap-3 ${className}`}
  >
    <div className="flex items-center gap-1">
      <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded bg-white pointer-events-none">
        Esc
      </kbd>
      <span>Unfocus filter</span>
    </div>
    <div className="flex items-center gap-1">
      <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded bg-white pointer-events-none">
        Ctrl
      </kbd>
      <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded bg-white pointer-events-none">
        ↑ or ↓
      </kbd>
      <span>Navigate items</span>
    </div>
    <div className="flex items-center gap-1">
      <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-500 border border-gray-300 rounded bg-white pointer-events-none">
        Enter
      </kbd>
      <span>Select or toggle</span>
    </div>
  </div>
);

export default SidebarNavigationHints;
