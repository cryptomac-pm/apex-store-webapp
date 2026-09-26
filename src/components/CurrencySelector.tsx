import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface CurrencySelectorProps {
  currentCurrency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  compact?: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onSelectCurrency,
  compact = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = CURRENCIES[currentCurrency] || CURRENCIES.USD;

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] ${
          isDark
            ? 'border-slate-700 bg-slate-900/90 text-slate-200 hover:text-white hover:border-[#ccff00]/60'
            : 'border-slate-300 bg-white text-slate-800 hover:text-black hover:border-slate-400 shadow-xs'
        } ${compact ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-xs font-semibold'}`}
        title="Change store currency"
        aria-label="Currency Selector"
      >
        <span className="text-sm">{selected.flag}</span>
        <span className="font-bold">{selected.code}</span>
        <span
          className={`font-mono text-[11px] ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          ({selected.symbol.trim()})
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1.5 w-60 rounded-xl border shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 ${
            isDark
              ? 'bg-[#0e131d] border-slate-700'
              : 'bg-white border-slate-200 shadow-xl'
          }`}
        >
          <div
            className={`px-3 py-1.5 border-b text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${
              isDark
                ? 'border-slate-800 text-slate-400'
                : 'border-slate-100 text-slate-500'
            }`}
          >
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#ccff00]" />
              Select Currency
            </span>
            <span className="text-slate-400">Live Rates</span>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
              const item = CURRENCIES[code];
              const isSelected = code === currentCurrency;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    onSelectCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors ${
                    isSelected
                      ? isDark
                        ? 'bg-[#ccff00]/15 text-[#ccff00] font-bold'
                        : 'bg-lime-50 text-lime-800 font-bold'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <div>
                      <div
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {item.code}{' '}
                        <span
                          className={`font-normal ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          ({item.symbol.trim()})
                        </span>
                      </div>
                      <div
                        className={`text-[10px] ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {item.name}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 ${
                        isDark ? 'text-[#ccff00]' : 'text-lime-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
