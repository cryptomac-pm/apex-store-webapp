import React, { useState } from 'react';
import { ShoppingBag, User, Search, X, Menu, ShieldCheck, MapPin } from 'lucide-react';
import { SportCategory, CurrencyCode } from '../types';
import { CurrencySelector } from './CurrencySelector';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  totalCartItems: number;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  selectedSport: SportCategory | 'All';
  onSelectSport: (sport: SportCategory | 'All') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigateHome: () => void;
  currentCurrency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalCartItems,
  onOpenCart,
  onOpenProfile,
  selectedSport,
  onSelectSport,
  searchQuery,
  onSearchChange,
  onNavigateHome,
  currentCurrency,
  onSelectCurrency,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories: (SportCategory | 'All')[] = [
    'All',
    'International Kits',
    'Club Kits',
    'Boots & Footwear',
    'Soccer',
    'Basketball',
    'Running',
    'Training',
  ];

  const handleCategoryClick = (cat: SportCategory | 'All') => {
    onSelectSport(cat);
    setMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-200 border-b ${
          isDark
            ? 'bg-[#0b0f17]/95 border-slate-800 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] shrink-0"
          >
            <div className="w-8 h-8 rounded bg-[#ccff00] flex items-center justify-center text-black font-black text-lg transition-transform group-hover:scale-105 shadow-sm">
              ▲
            </div>
            <span
              className={`text-xl sm:text-2xl font-black tracking-wider uppercase font-display ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              APEX{' '}
              <span className={isDark ? 'text-[#ccff00]' : 'text-lime-600'}>
                ATHLETICS
              </span>
            </span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-semibold tracking-wide overflow-x-auto no-scrollbar py-2">
            {categories.slice(0, 6).map((cat) => {
              const isActive = selectedSport === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`relative py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? isDark
                        ? 'text-[#ccff00]'
                        : 'text-lime-700 font-bold'
                      : isDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'All' ? 'All Kits' : cat}
                  {isActive && (
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${
                        isDark ? 'bg-[#ccff00]' : 'bg-lime-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
            <button
              onClick={() => {
                const headings = Array.from(document.querySelectorAll('h2'));
                const target = headings.find((h) =>
                  h.textContent?.includes('LOCATE MATCH PITCHES')
                );
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`py-1 transition-colors whitespace-nowrap flex items-center gap-1 text-xs ${
                isDark
                  ? 'text-slate-400 hover:text-[#ccff00]'
                  : 'text-slate-500 hover:text-lime-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>Court Finder</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Theme Toggle + Currency Selector + Search + Cart + Profile) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Toggle Button */}
            <ThemeToggle compact />

            {/* Currency Selector System */}
            <CurrencySelector
              currentCurrency={currentCurrency}
              onSelectCurrency={onSelectCurrency}
            />

            {/* Desktop Search */}
            <div className="hidden md:flex items-center relative w-40 xl:w-52">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search kits, boots..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={`w-full rounded-lg pl-9 pr-8 py-1.5 text-xs focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700/80 text-slate-200 placeholder:text-slate-400 focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00]'
                    : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-lime-600 focus:ring-1 focus:ring-lime-600'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Profile / Login */}
            <button
              onClick={onOpenProfile}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="User Account"
              title="Pro Member Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Cart button with dynamic item counter */}
            <button
              onClick={onOpenCart}
              className={`relative flex items-center justify-center p-2 sm:px-3 sm:py-2 rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] ${
                isDark
                  ? 'bg-slate-900 hover:bg-slate-800 border-slate-700/80 text-white hover:border-[#ccff00]/60'
                  : 'bg-slate-900 hover:bg-black border-slate-900 text-white shadow-xs'
              }`}
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#ccff00]" />
              <span className="ml-1.5 hidden xl:inline text-xs font-bold text-slate-200">
                Cart
              </span>
              {totalCartItems > 0 && (
                <span className="ml-1 sm:ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#ccff00] text-black font-extrabold text-[11px] tabular-nums">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown Bar */}
        {searchOpen && (
          <div
            className={`md:hidden px-4 pb-3 pt-1 border-t ${
              isDark ? 'border-slate-800 bg-[#0b0f17]' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search jerseys, boots, trainers..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className={`w-full rounded-lg pl-9 pr-9 py-2 text-sm focus:outline-none ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-400 focus:border-[#ccff00]'
                    : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-lime-600'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Nav Links Drawer */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 ${
              isDark ? 'border-slate-800 bg-[#0e131d]' : 'border-slate-200 bg-white shadow-xl'
            }`}
          >
            {/* Theme & Currency Row */}
            <div
              className={`flex items-center justify-between pb-3 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Theme:
                </span>
                <ThemeToggle showLabel />
              </div>
              <div className="flex items-center gap-2">
                <CurrencySelector
                  currentCurrency={currentCurrency}
                  onSelectCurrency={onSelectCurrency}
                  compact
                />
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Sports & Collections
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {categories.map((cat) => {
                const isActive = selectedSport === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? isDark
                          ? 'bg-[#ccff00]/15 text-[#ccff00]'
                          : 'bg-lime-100 text-lime-800 font-bold'
                        : isDark
                        ? 'text-slate-200 hover:bg-slate-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat === 'All' ? 'All Kits & Gear' : cat}</span>
                    {isActive && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isDark ? 'bg-[#ccff00]' : 'bg-lime-600'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div
              className={`pt-3 border-t flex items-center justify-between text-xs text-slate-400 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#ccff00]" /> Authentic Matchwear
              </span>
              <span>Global Currency Pricing</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
