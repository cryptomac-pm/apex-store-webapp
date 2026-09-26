import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SportCategory } from '../types';
import { CATEGORIES_META } from '../data/products';
import { useTheme } from '../context/ThemeContext';

interface ShopBySportProps {
  selectedSport: SportCategory | 'All';
  onSelectSport: (sport: SportCategory) => void;
}

export const ShopBySport: React.FC<ShopBySportProps> = ({
  selectedSport,
  onSelectSport,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="categories-section"
      className={`py-14 sm:py-20 border-b transition-colors ${
        isDark ? 'bg-[#0b0f17] border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div
              className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                isDark ? 'text-[#ccff00]' : 'text-lime-700'
              }`}
            >
              Performance Disciplines & Drops
            </div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-display ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              SHOP BY SPORT & COLLECTION
            </h2>
          </div>
          <p
            className={`text-xs sm:text-sm max-w-md ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Engineered kit specifications, international tournament jerseys, European club editions, and elite carbon-plate footwear.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES_META.map((cat) => {
            const isSelected = selectedSport === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectSport(cat.id);
                  const catalog = document.getElementById('catalog-section');
                  if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                  isSelected
                    ? isDark
                      ? 'border-[#ccff00] ring-1 ring-[#ccff00] shadow-lg shadow-[#ccff00]/10 bg-slate-900'
                      : 'border-lime-500 ring-2 ring-lime-500 shadow-md bg-white'
                    : isDark
                    ? 'border-slate-800 hover:border-slate-600 bg-slate-900'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md bg-white'
                }`}
              >
                {/* Background image with overlay */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950 relative">
                  <img
                    src={cat.image}
                    alt={`${cat.name} Collection`}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                  {/* Item count tag top-right */}
                  <span className="absolute top-3 right-3 text-[11px] font-bold tracking-wider text-slate-200 bg-black/75 px-2 py-0.5 rounded border border-white/20 backdrop-blur-xs">
                    {cat.itemCount} ITEMS
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 relative">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-lg sm:text-xl font-bold uppercase tracking-wide font-display transition-colors ${
                        isDark
                          ? 'text-white group-hover:text-[#ccff00]'
                          : 'text-slate-900 group-hover:text-lime-700'
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isDark
                          ? 'bg-slate-800 text-slate-300 group-hover:bg-[#ccff00] group-hover:text-black'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <p
                    className={`mt-1 text-xs line-clamp-2 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {cat.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
