import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 ${
        isDark
          ? 'bg-slate-800 hover:bg-slate-700/80 text-amber-300 border-slate-700 shadow-sm shadow-amber-500/5'
          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle Light and Dark Theme"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {/* Sun Icon (Visible in light mode) */}
        <Sun
          className={`w-4 h-4 text-amber-500 transition-all duration-300 ${
            isDark
              ? 'scale-0 rotate-90 opacity-0 absolute'
              : 'scale-100 rotate-0 opacity-100'
          }`}
        />
        {/* Moon Icon (Visible in dark mode) */}
        <Moon
          className={`w-4 h-4 text-amber-300 transition-all duration-300 ${
            isDark
              ? 'scale-100 rotate-0 opacity-100'
              : 'scale-0 -rotate-90 opacity-0 absolute'
          }`}
        />
      </div>

      {showLabel ? (
        <span className="text-[11px] font-semibold">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      ) : (
        <span className="text-[11px] font-medium hidden lg:inline">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
