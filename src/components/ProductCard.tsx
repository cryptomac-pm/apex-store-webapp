import React, { useState } from 'react';
import { Star, Check, Plus, Eye } from 'lucide-react';
import { Product, KitSize, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: KitSize) => void;
  onOpenQuickView: (product: Product) => void;
  currentCurrency: CurrencyCode;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenQuickView,
  currentCurrency,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedSize, setSelectedSize] = useState<KitSize>(product.sizes[0] || 'M');
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const isFootwear = product.productType === 'boots' || product.productType === 'trainers';

  return (
    <div
      onClick={() => onOpenQuickView(product)}
      className={`group relative flex flex-col rounded-xl border transition-all duration-200 hover:-translate-y-1 cursor-pointer overflow-hidden ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-600 hover:shadow-xl hover:shadow-black/50'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/80'
      }`}
    >
      {/* Product Image Area */}
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden ${
          isDark ? 'bg-slate-950' : 'bg-slate-100'
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Edition subtle text tag */}
        {product.badge && (
          <div
            className={`absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-sm ${
              isDark
                ? 'text-slate-200 bg-slate-950/85 border border-slate-700/80'
                : 'text-slate-800 bg-white/90 border border-slate-200 shadow-xs'
            }`}
          >
            {product.badge}
          </div>
        )}

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickView(product);
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 backdrop-blur-sm shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Brand & Category / Rating */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div
            className={`font-semibold uppercase tracking-wider truncate max-w-[68%] flex items-center gap-1.5 ${
              isDark ? 'text-[#ccff00]' : 'text-lime-700'
            }`}
          >
            {product.brand && (
              <span
                className={`text-[10px] font-black tracking-normal px-1.5 py-0.5 rounded border shrink-0 ${
                  isDark
                    ? 'bg-slate-800/90 text-slate-200 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {product.brand}
              </span>
            )}
            <span className="truncate">{product.teamOrNation || product.sport}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span
              className={`font-bold tabular-nums ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              {product.rating}
            </span>
            <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3
          className={`text-base font-bold transition-colors leading-snug line-clamp-1 mb-2 ${
            isDark
              ? 'text-white group-hover:text-[#ccff00]'
              : 'text-slate-900 group-hover:text-lime-700'
          }`}
        >
          {product.name}
        </h3>

        {/* Size Selection Row */}
        <div
          className="flex items-center gap-1 mb-4 flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className={`text-[11px] font-medium mr-1 ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {isFootwear ? 'Size:' : 'Fit:'}
          </span>
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`px-2 h-6 text-[11px] font-bold rounded flex items-center justify-center transition-colors ${
                selectedSize === size
                  ? isDark
                    ? 'bg-[#ccff00] text-black font-extrabold shadow-xs'
                    : 'bg-slate-900 text-white font-extrabold shadow-xs'
                  : isDark
                  ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {size.replace('US ', '')}
            </button>
          ))}
        </div>

        {/* Price in Selected Currency and Add to Cart action */}
        <div
          className={`mt-auto pt-3 border-t flex items-center justify-between gap-2 ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}
        >
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-lg font-black tabular-nums ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {formatCurrency(product.price, currentCurrency)}
              </span>
              {product.originalPrice && (
                <span
                  className={`text-xs line-through tabular-nums ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {formatCurrency(product.originalPrice, currentCurrency)}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Tax calculated at checkout
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`px-3 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] shrink-0 ${
              justAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#ccff00] text-black hover:bg-[#b8e600] active:scale-95 shadow-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
