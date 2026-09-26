import React from 'react';
import { Filter, RotateCcw, ArrowUpDown, X } from 'lucide-react';
import { FilterState, SportCategory, KitSize } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  totalProducts: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
  totalProducts,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sports: (SportCategory | 'All')[] = [
    'All',
    'International Kits',
    'Club Kits',
    'Boots & Footwear',
    'Soccer',
    'Basketball',
    'Running',
    'Training',
  ];

  const brands = ['All', 'Nike', 'Adidas', 'Puma', 'Mizuno', 'Apex'];

  const sizes: (KitSize | 'All')[] = [
    'All',
    'S',
    'M',
    'L',
    'XL',
    'US 8',
    'US 9',
    'US 10',
    'US 11',
  ];

  const hasActiveFilters =
    filters.sport !== 'All' ||
    (filters.brand && filters.brand !== 'All') ||
    filters.size !== 'All' ||
    filters.sortBy !== 'featured' ||
    filters.searchQuery.trim() !== '';

  return (
    <div
      className={`rounded-xl border p-5 space-y-6 transition-colors ${
        isDark
          ? 'bg-slate-900/90 border-slate-800'
          : 'bg-white border-slate-200 shadow-xs'
      }`}
    >
      <div
        className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}
      >
        <div
          className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          <Filter
            className={`w-4 h-4 ${isDark ? 'text-[#ccff00]' : 'text-lime-600'}`}
          />
          <span>Filter Kits & Gear</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className={`text-xs flex items-center gap-1 transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-[#ccff00]'
                : 'text-slate-500 hover:text-lime-700'
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sort By Selector */}
      <div className="space-y-2">
        <label
          className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          <ArrowUpDown
            className={`w-3.5 h-3.5 ${isDark ? 'text-[#ccff00]' : 'text-lime-600'}`}
          />
          Sort Order
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sortBy: e.target.value as FilterState['sortBy'],
            })
          }
          className={`w-full rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none transition-colors ${
            isDark
              ? 'bg-slate-950 border border-slate-700 text-slate-200 focus:border-[#ccff00]'
              : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-lime-600'
          }`}
        >
          <option value="featured">Featured / Tournament Drops</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Highest Rated (5.0★)</option>
        </select>
      </div>

      {/* Sport Category Filter */}
      <div className="space-y-2.5">
        <div
          className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Discipline & Collection
        </div>
        <div className="space-y-1">
          {sports.map((sport) => {
            const isSelected = filters.sport === sport;
            return (
              <button
                key={sport}
                type="button"
                onClick={() => onFilterChange({ ...filters, sport })}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  isSelected
                    ? isDark
                      ? 'bg-[#ccff00]/15 text-[#ccff00] font-bold border border-[#ccff00]/30'
                      : 'bg-lime-50 text-lime-800 font-bold border border-lime-300'
                    : isDark
                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{sport === 'All' ? 'All Kits & Footwear' : sport}</span>
                {isSelected && (
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
      </div>

      {/* Brand Filter */}
      <div className="space-y-2.5">
        <div
          className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Brand & Maker
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {brands.map((brand) => {
            const isSelected = (filters.brand || 'All') === brand;
            return (
              <button
                key={brand}
                type="button"
                onClick={() => onFilterChange({ ...filters, brand })}
                className={`h-8 rounded text-xs font-bold transition-all flex items-center justify-center ${
                  isSelected
                    ? isDark
                      ? 'bg-[#ccff00] text-black font-extrabold shadow-xs'
                      : 'bg-slate-900 text-white font-extrabold shadow-xs'
                    : isDark
                    ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2.5">
        <div
          className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          Size (Apparel & Footwear)
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {sizes.map((size) => {
            const isSelected = filters.size === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => onFilterChange({ ...filters, size })}
                className={`h-8 rounded text-[11px] font-bold transition-all flex items-center justify-center ${
                  isSelected
                    ? isDark
                      ? 'bg-[#ccff00] text-black font-extrabold shadow-xs'
                      : 'bg-slate-900 text-white font-extrabold shadow-xs'
                    : isDark
                    ? 'bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {size.replace('US ', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Chips readout */}
      {hasActiveFilters && (
        <div
          className={`pt-2 border-t space-y-2 ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div
            className={`text-[11px] font-medium ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Active Filters:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.sport !== 'All' && (
              <button
                onClick={() => onFilterChange({ ...filters, sport: 'All' })}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  isDark
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:text-black'
                }`}
              >
                Category: {filters.sport}
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
            {filters.brand && filters.brand !== 'All' && (
              <button
                onClick={() => onFilterChange({ ...filters, brand: 'All' })}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  isDark
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:text-black'
                }`}
              >
                Brand: {filters.brand}
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
            {filters.size !== 'All' && (
              <button
                onClick={() => onFilterChange({ ...filters, size: 'All' })}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  isDark
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:text-black'
                }`}
              >
                Size: {filters.size}
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
            {filters.searchQuery && (
              <button
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  isDark
                    ? 'bg-slate-800 text-slate-200 border-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-800 border-slate-200 hover:text-black'
                }`}
              >
                "{filters.searchQuery}"
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Count summary */}
      <div
        className={`pt-4 border-t text-[11px] text-center ${
          isDark
            ? 'border-slate-800 text-slate-400'
            : 'border-slate-100 text-slate-500'
        }`}
      >
        Showing{' '}
        <span
          className={`font-bold tabular-nums ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          {totalFiltered}
        </span>{' '}
        of{' '}
        <span
          className={`font-bold tabular-nums ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}
        >
          {totalProducts}
        </span>{' '}
        Products Available
      </div>
    </div>
  );
};
