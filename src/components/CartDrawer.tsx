import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag, Check, Globe } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatCurrency, CURRENCIES } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
  currentCurrency: CurrencyCode;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
  currentCurrency,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  // Base USD calculations
  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discountUSD = 0;
  if (appliedPromo === 'APEX15') {
    discountUSD = Math.round(subtotalUSD * 0.15 * 100) / 100;
  } else if (appliedPromo === 'CHAMPION') {
    discountUSD = Math.min(20, subtotalUSD);
  }

  const discountedSubtotalUSD = Math.max(0, subtotalUSD - discountUSD);
  const freeShippingThresholdUSD = 100;
  const shippingUSD = discountedSubtotalUSD >= freeShippingThresholdUSD || cartItems.length === 0 ? 0 : 12;
  const amountToFreeShippingUSD = Math.max(0, freeShippingThresholdUSD - discountedSubtotalUSD);
  const freeShippingProgress = Math.min(100, Math.round((discountedSubtotalUSD / freeShippingThresholdUSD) * 100));

  const taxUSD = Math.round(discountedSubtotalUSD * 0.08 * 100) / 100;
  const finalTotalUSD = Math.round((discountedSubtotalUSD + shippingUSD + taxUSD) * 100) / 100;

  const currencyInfo = CURRENCIES[currentCurrency] || CURRENCIES.USD;

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    const res = onApplyPromo(promoCodeInput.trim());
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setPromoCodeInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md border-l flex flex-col shadow-2xl transition-colors duration-200 ${
            isDark
              ? 'bg-[#0e131d] border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-4 sm:p-6 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag
                className={`w-5 h-5 ${
                  isDark ? 'text-[#ccff00]' : 'text-lime-600'
                }`}
              />
              <h2
                className={`text-lg font-black uppercase font-display tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                YOUR ATHLETIC BAG
              </h2>
              <span className="text-xs font-bold text-slate-400 tabular-nums">
                ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                  isDark
                    ? 'text-slate-300 bg-slate-900 border-slate-700'
                    : 'text-slate-700 bg-slate-100 border-slate-200'
                }`}
              >
                {currencyInfo.flag} {currencyInfo.code}
              </span>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-black hover:bg-slate-100'
                }`}
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress bar */}
          {cartItems.length > 0 && (
            <div
              className={`px-6 py-3 border-b text-xs ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-slate-50 border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 font-medium">
                {shippingUSD === 0 ? (
                  <span
                    className={`font-bold flex items-center gap-1.5 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> Free Express Shipping Unlocked!
                  </span>
                ) : (
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    Add{' '}
                    <span
                      className={`font-bold tabular-nums ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {formatCurrency(amountToFreeShippingUSD, currentCurrency)}
                    </span>{' '}
                    more for Free Delivery
                  </span>
                )}
                <span className="text-slate-400 tabular-nums">
                  {freeShippingProgress}%
                </span>
              </div>
              <div
                className={`w-full h-1.5 rounded-full overflow-hidden ${
                  isDark ? 'bg-slate-800' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    isDark ? 'bg-[#ccff00]' : 'bg-lime-500'
                  }`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div
                  className={`w-16 h-16 rounded-full border flex items-center justify-center mb-4 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-500'
                      : 'bg-slate-100 border-slate-200 text-slate-400'
                  }`}
                >
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3
                  className={`text-base font-bold uppercase tracking-wide font-display ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Your Kit Bag is Empty
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">
                  Gear up with international jerseys, European club kits, soccer boots, or trainers.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-5 py-2.5 rounded-lg bg-[#ccff00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors shadow-xs"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-3 rounded-xl border relative group transition-colors ${
                    isDark
                      ? 'bg-slate-900/70 border-slate-800/90'
                      : 'bg-slate-50 border-slate-200 shadow-xs'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border ${
                      isDark
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="pr-6">
                      <div
                        className={`text-[11px] font-semibold uppercase tracking-wider ${
                          isDark ? 'text-[#ccff00]' : 'text-lime-700'
                        }`}
                      >
                        {item.sport}
                      </div>
                      <h4
                        className={`text-sm font-bold truncate ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.name}
                      </h4>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Size:{' '}
                        <span
                          className={`font-bold ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {item.size}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-between mt-2 pt-2 border-t ${
                        isDark ? 'border-slate-800/80' : 'border-slate-200'
                      }`}
                    >
                      {/* Quantity Stepper */}
                      <div
                        className={`flex items-center gap-2 border rounded-md p-0.5 ${
                          isDark
                            ? 'bg-slate-950 border-slate-800'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                            isDark
                              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                              : 'text-slate-500 hover:text-black hover:bg-slate-100'
                          }`}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span
                          className={`w-6 text-center text-xs font-bold tabular-nums ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                            isDark
                              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                              : 'text-slate-500 hover:text-black hover:bg-slate-100'
                          }`}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span
                          className={`text-sm font-bold tabular-nums ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {formatCurrency(item.price * item.quantity, currentCurrency)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer with Calculations in Target Currency */}
          {cartItems.length > 0 && (
            <div
              className={`p-4 sm:p-6 border-t space-y-4 ${
                isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
              }`}
            >
              {/* Promo Code Form */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Code "{appliedPromo}" Active</span>
                    </div>
                    <button
                      onClick={onRemovePromo}
                      className="text-slate-400 hover:text-white text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromoCode} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. APEX15)"
                        value={promoCodeInput}
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value.toUpperCase());
                          setPromoMessage(null);
                        }}
                        className={`flex-1 rounded-lg px-3 py-1.5 text-xs uppercase tracking-wider focus:outline-none ${
                          isDark
                            ? 'bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-400 focus:border-[#ccff00]'
                            : 'bg-white border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-lime-600'
                        }`}
                      />
                      <button
                        type="submit"
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-white'
                            : 'bg-slate-900 hover:bg-black text-white'
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                    {promoMessage && (
                      <p
                        className={`text-[11px] ${
                          promoMessage.isError ? 'text-red-400' : 'text-emerald-500'
                        }`}
                      >
                        {promoMessage.text}
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Dynamic Financial Calculation in Local Currency */}
              <div
                className={`space-y-2 text-xs ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Subtotal ({currencyInfo.code})
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {formatCurrency(subtotalUSD, currentCurrency)}
                  </span>
                </div>

                {discountUSD > 0 && (
                  <div className="flex justify-between text-emerald-500 font-semibold">
                    <span>Discount ({appliedPromo})</span>
                    <span className="tabular-nums">
                      -{formatCurrency(discountUSD, currentCurrency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Estimated Shipping
                  </span>
                  <span className="font-semibold tabular-nums">
                    {shippingUSD === 0 ? (
                      <span className={isDark ? 'text-[#ccff00]' : 'text-lime-700 font-bold'}>
                        FREE
                      </span>
                    ) : (
                      formatCurrency(shippingUSD, currentCurrency)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                    Estimated Tax (8%)
                  </span>
                  <span
                    className={`font-semibold tabular-nums ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {formatCurrency(taxUSD, currentCurrency)}
                  </span>
                </div>

                <div
                  className={`pt-2 border-t flex justify-between items-baseline text-sm ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col">
                    <span
                      className={`font-bold uppercase tracking-wider ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Final Total
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Exact amount in {currencyInfo.name}
                    </span>
                  </div>
                  <span
                    className={`text-xl font-black tabular-nums font-display ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-700'
                    }`}
                  >
                    {formatCurrency(finalTotalUSD, currentCurrency)}
                  </span>
                </div>
              </div>

              {/* Prominent Proceed to Checkout Button */}
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-lg bg-[#ccff00] hover:bg-[#b8e600] active:scale-[0.99] text-black font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ccff00]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck
                  className={`w-3.5 h-3.5 ${
                    isDark ? 'text-[#ccff00]' : 'text-lime-600'
                  }`}
                />
                <span>Exact Currency Guaranteed · No Hidden Conversion Fees</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
