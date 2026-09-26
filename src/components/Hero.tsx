import React from 'react';
import { ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/apex_hero_banner_1790417004631.jpg';

interface HeroProps {
  onShopLatest: () => void;
  onExploreCategories: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopLatest, onExploreCategories }) => {
  return (
    <section className="relative overflow-hidden bg-[#0b0f17] border-b border-slate-800">
      {/* Background Hero Banner Image with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Apex Athletics Elite Matchwear and Athletes"
          className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark gradient scrims for AA legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17] via-[#0b0f17]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="max-w-2xl">
          {/* Subtle text kicker (unboxed, no static pill badge) */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#ccff00] mb-4">
            <Zap className="w-4 h-4 fill-[#ccff00]" />
            <span>2026 Pro Match Series</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">Zero-Friction AeroWeave™</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[0.95] font-display text-balance">
            ENGINEERED FOR <span className="text-[#ccff00]">SUPREMACY</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
            Tour-level sports kits meticulously woven for uncompromising breathability, dynamic freedom, and peak kinetic output across every pitch, court, and track.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onShopLatest}
              className="px-6 py-3.5 rounded-lg bg-[#ccff00] text-black font-extrabold text-sm sm:text-base tracking-wide uppercase hover:bg-[#b8e600] active:scale-[0.98] transition-all shadow-lg shadow-[#ccff00]/20 flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#ccff00]"
            >
              <span>Shop Latest Kits</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={onExploreCategories}
              className="px-6 py-3.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base tracking-wide border border-slate-700 hover:border-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              Shop By Sport
            </button>
          </div>

          {/* Adjacent Trust Proof Bar */}
          <div className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-display tabular-nums">
                68g <span className="text-[#ccff00] text-base">Ultralight</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Featherweight matrix</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-display tabular-nums">
                0.4s <span className="text-[#ccff00] text-base">DryRate</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Thermal sweat dispersion</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white font-display tabular-nums">
                40k+ <span className="text-[#ccff00] text-base">Athletes</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Global tournament wearers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
