import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  compact = false,
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] ${
        isDark
          ? 'bg-slate-900/90 border-slate-700 text-amber-300 hover:text-amber-200 hover:border-amber-400/50 hover:bg-slate-800'
          : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50 shadow-xs'
      } ${compact ? 'p-1.5' : 'p-2 sm:px-2.5 sm:py-2'} ${showLabel ? 'gap-2 px-3' : ''}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {isDark ? (
        <Sun className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-amber-400 transition-transform duration-300 hover:rotate-45`} />
      ) : (
        <Moon className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-indigo-600 transition-transform duration-300 hover:-rotate-12`} />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
