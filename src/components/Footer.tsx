import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, RefreshCw, Zap, Check } from 'lucide-react';
import { SportCategory } from '../types';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onSelectSport: (sport: SportCategory | 'All') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSport }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleSportClick = (sport: SportCategory) => {
    onSelectSport(sport);
    const catalog = document.getElementById('catalog-section');
    if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className={`border-t transition-colors ${
        isDark
          ? 'bg-slate-950 border-slate-800 text-slate-400'
          : 'bg-white border-slate-200 text-slate-600'
      }`}
    >
      {/* Value Pillars Row */}
      <div
        className={`border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-100 bg-slate-50/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-[#ccff00]'
                  : 'bg-lime-50 border-lime-200 text-lime-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4
                className={`text-sm font-bold uppercase tracking-wide ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Tournament Grade Quality
              </h4>
              <p
                className={`text-xs mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Woven to meet the stringent standards of FIFA, FIBA, and World Athletics.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-[#ccff00]'
                  : 'bg-lime-50 border-lime-200 text-lime-700'
              }`}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4
                className={`text-sm font-bold uppercase tracking-wide ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Express Global Dispatch
              </h4>
              <p
                className={`text-xs mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Tracked matchday delivery within 48-72 hours. Free on orders above $100.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-[#ccff00]'
                  : 'bg-lime-50 border-lime-200 text-lime-700'
              }`}
            >
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4
                className={`text-sm font-bold uppercase tracking-wide ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                30-Day Fit Guarantee
              </h4>
              <p
                className={`text-xs mt-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Complimentary size exchanges and rapid returns on unworn competition apparel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#ccff00] flex items-center justify-center text-black font-black text-base shadow-xs">
              ▲
            </div>
            <span
              className={`text-xl font-black tracking-wider uppercase font-display ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              APEX{' '}
              <span className={isDark ? 'text-[#ccff00]' : 'text-lime-700'}>
                ATHLETICS
              </span>
            </span>
          </div>
          <p
            className={`text-xs max-w-sm leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Crafting aerodynamic sports kits and technical apparel for athletes striving for supremacy on the pitch, hardwood, running track, and training grounds.
          </p>

          {/* Newsletter Subscribe */}
          <div className="pt-2">
            <div
              className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Receive Kit Drop Alerts
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs focus:outline-none ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:border-[#ccff00]'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-lime-600'
                }`}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#ccff00] text-black font-extrabold uppercase text-xs rounded-lg hover:bg-[#b8e600] transition-colors flex items-center gap-1 shadow-xs"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <span>Join</span>}
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-500 text-[11px] mt-1.5 font-medium">
                Welcome to the roster! Check your inbox for your 15% code.
              </p>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Performance Disciplines
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => handleSportClick('International Kits')}
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-slate-900'
                }`}
              >
                International Jerseys
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSportClick('Club Kits')}
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-slate-900'
                }`}
              >
                European Club Matchwear
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSportClick('Boots & Footwear')}
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-slate-900'
                }`}
              >
                Cleats & Nitrogen Trainers
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSportClick('Soccer')}
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-slate-900'
                }`}
              >
                Soccer AeroMatch Kits
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSportClick('Basketball')}
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-slate-900'
                }`}
              >
                Basketball Circuit Jerseys
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSportClick('Running')}
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-slate-900'
                }`}
              >
                Ultralight Marathon Singlets
              </button>
            </li>
            <li>
              <button
                onClick={() => handleSportClick('Training')}
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-slate-900'
                }`}
              >
                Conditioning & Compression Sets
              </button>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div className="space-y-3">
          <h4
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Support & Sizing
          </h4>
          <ul className="space-y-2 text-xs">
            <li
              className={`transition-colors cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              Kit Sizing & Fit Guide
            </li>
            <li
              className={`transition-colors cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              Shipping & Order Tracking
            </li>
            <li
              className={`transition-colors cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              Team Orders & Club Inquiries
            </li>
            <li
              className={`transition-colors cursor-pointer ${
                isDark ? 'hover:text-white' : 'hover:text-slate-900'
              }`}
            >
              Privacy Policy & Terms
            </li>
          </ul>
        </div>
      </div>

      {/* Quiet bottom bar */}
      <div
        className={`border-t py-5 ${
          isDark
            ? 'border-slate-900 bg-black/60 text-slate-400'
            : 'border-slate-200 bg-slate-100 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-[11px] gap-2">
          <div>
            © {new Date().getFullYear()} Apex Athletics Inc. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Designed for Peak Athletics</span>
            <span>·</span>
            <span>Worldwide Matchwear & Boots</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
