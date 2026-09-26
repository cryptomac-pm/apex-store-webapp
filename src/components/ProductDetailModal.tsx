import React, { useState } from 'react';
import { X, Star, Check, Plus, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { Product, KitSize, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: KitSize) => void;
  currentCurrency: CurrencyCode;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  currentCurrency,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedSize, setSelectedSize] = useState<KitSize>('M');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isFootwear = product.productType === 'boots' || product.productType === 'trainers';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div
        className={`relative w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden z-10 my-8 border transition-colors ${
          isDark
            ? 'bg-[#0e131d] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 rounded-full border transition-colors ${
            isDark
              ? 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
              : 'bg-white/90 border-slate-200 text-slate-500 hover:text-black shadow-xs'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Column */}
          <div
            className={`relative aspect-[4/3] md:aspect-auto md:h-full overflow-hidden ${
              isDark ? 'bg-slate-950' : 'bg-slate-100'
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.badge && (
              <div
                className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded border backdrop-blur-xs ${
                  isDark
                    ? 'text-slate-200 bg-slate-950/90 border-slate-700'
                    : 'text-slate-800 bg-white/90 border-slate-200 shadow-xs'
                }`}
              >
                {product.badge}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Team / Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span
                  className={`font-bold uppercase tracking-wider ${
                    isDark ? 'text-[#ccff00]' : 'text-lime-700'
                  }`}
                >
                  {product.teamOrNation || product.sport}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span
                    className={`font-bold tabular-nums ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {product.rating}
                  </span>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2
                className={`text-2xl sm:text-3xl font-black uppercase font-display leading-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {product.name}
              </h2>

              {/* Price in current currency */}
              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className={`text-2xl font-black font-display tabular-nums ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {formatCurrency(product.price, currentCurrency)}
                </span>
                {product.originalPrice && (
                  <span
                    className={`text-sm line-through tabular-nums ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {formatCurrency(product.originalPrice, currentCurrency)}
                  </span>
                )}
                <span className="text-xs text-slate-400 ml-2">Exact currency price</span>
              </div>

              {/* Description */}
              <p
                className={`mt-4 text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {product.description}
              </p>

              {/* Technical Specifications */}
              <div className="mt-5 space-y-2">
                <div
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Performance Architecture
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {product.technology.map((tech) => (
                    <div
                      key={tech}
                      className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border ${
                        isDark
                          ? 'text-slate-300 bg-slate-900/80 border-slate-800'
                          : 'text-slate-700 bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Zap
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isDark ? 'text-[#ccff00]' : 'text-lime-600'
                        }`}
                      />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2 font-medium">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {isFootwear ? 'Select Footwear Size' : 'Select Kit Size'}
                  </span>
                  <span className="text-slate-400">
                    {isFootwear ? 'US Standard Sizing' : 'Athletic Pro Fit'}
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        selectedSize === size
                          ? isDark
                            ? 'bg-[#ccff00] text-black font-extrabold shadow-md'
                            : 'bg-slate-900 text-white font-extrabold shadow-md'
                          : isDark
                          ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              className={`mt-8 pt-4 border-t space-y-3 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-3.5 rounded-lg text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#ccff00] hover:bg-[#b8e600] text-black shadow-[#ccff00]/15'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Cart ({selectedSize})</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Add to Bag — {formatCurrency(product.price, currentCurrency)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck
                    className={`w-3.5 h-3.5 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-600'
                    }`}
                  />{' '}
                  100% Authentic Matchwear
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-600'
                    }`}
                  />{' '}
                  30-Day Free Exchanges
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
