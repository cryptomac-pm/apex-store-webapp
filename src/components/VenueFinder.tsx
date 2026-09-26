import React, { useState } from 'react';
import { MapPin, Search, ExternalLink, Sparkles, Trophy } from 'lucide-react';
import { SportCategory } from '../types';
import { useTheme } from '../context/ThemeContext';

interface Venue {
  title: string;
  uri?: string;
  snippets?: string[];
}

export const VenueFinder: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedSport, setSelectedSport] = useState<SportCategory>('Soccer');
  const [locationQuery, setLocationQuery] = useState('');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [analysisText, setAnalysisText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const sportsList: { sport: SportCategory; label: string; iconLabel: string }[] = [
    { sport: 'Soccer', label: 'Soccer Pitches & Turfs', iconLabel: '⚽' },
    { sport: 'Basketball', label: 'Basketball Courts', iconLabel: '🏀' },
    { sport: 'Running', label: 'Running Tracks & Loops', iconLabel: '🏃' },
    { sport: 'Training', label: 'Training Facilities', iconLabel: '🏋️' },
  ];

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery !== undefined ? overrideQuery : locationQuery;
    setIsLoading(true);
    setHasSearched(true);

    try {
      let userLocation: { latitude: number; longitude: number } | undefined;

      if (!q.trim() && 'geolocation' in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 6000 });
          });
          userLocation = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
        } catch {
          // Continue without coordinates
        }
      }

      const res = await fetch('/api/find-facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sport: selectedSport,
          query: q.trim() || undefined,
          userLocation,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch sports facilities');
      }

      const data = await res.json();
      setAnalysisText(data.description || '');
      setVenues(data.venues || []);
    } catch (err) {
      console.error('Venue search failed:', err);
      setAnalysisText('Unable to complete Google Maps lookup at this time. Please specify a city or region.');
      setVenues([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className={`py-14 sm:py-20 border-t transition-colors ${
        isDark ? 'bg-[#090d14] border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-1 ${
                isDark ? 'text-[#ccff00]' : 'text-lime-700'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Google Maps Grounded Scout</span>
            </div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-display ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              LOCATE MATCH PITCHES & COURTS
            </h2>
          </div>
          <p
            className={`text-xs sm:text-sm max-w-md ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Find tournament-ready turf fields, indoor basketball courts, and all-weather synthetic running tracks near you.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 mb-8 space-y-4 transition-colors ${
            isDark
              ? 'bg-slate-900/90 border-slate-800'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          {/* Sport Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {sportsList.map((item) => (
              <button
                key={item.sport}
                type="button"
                onClick={() => setSelectedSport(item.sport)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedSport === item.sport
                    ? isDark
                      ? 'bg-[#ccff00] text-black shadow-md'
                      : 'bg-slate-900 text-white shadow-md'
                    : isDark
                    ? 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{item.iconLabel}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Location Input Form */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter city, neighborhood, or stadium name (e.g., Seattle, Chicago, Brooklyn)..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                className={`w-full rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-950 border border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#ccff00]'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-lime-600'
                }`}
              />
            </div>

            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ccff00]/15 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Grounding via Maps...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 stroke-[3]" />
                  <span>Scout Venues</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Popular Searches:</span>
            {['Chicago, IL', 'Austin, TX', 'London UK', 'Melbourne'].map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setLocationQuery(city);
                  handleSearch(city);
                }}
                className={`underline transition-colors ${
                  isDark ? 'text-slate-300 hover:text-[#ccff00]' : 'text-slate-600 hover:text-lime-700'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Results Display */}
        {hasSearched && (
          <div className="space-y-6">
            {/* Grounding Summary */}
            {analysisText && (
              <div
                className={`p-4 sm:p-5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                }`}
              >
                <div
                  className={`flex items-center gap-2 font-bold uppercase tracking-wider text-xs mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <Trophy
                    className={`w-4 h-4 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-600'
                    }`}
                  />
                  <span>Scout Analysis (Powered by gemini-3.5-flash)</span>
                </div>
                <p className="whitespace-pre-wrap">{analysisText}</p>
              </div>
            )}

            {/* Venues Grid with Google Maps Grounding links */}
            {venues.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {venues.map((venue, idx) => (
                  <div
                    key={idx}
                    className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-600'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isDark
                                ? 'bg-[#ccff00]/15 text-[#ccff00]'
                                : 'bg-lime-100 text-lime-700'
                            }`}
                          >
                            <MapPin className="w-4 h-4" />
                          </div>
                          <h4
                            className={`text-sm font-bold leading-tight ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {venue.title}
                          </h4>
                        </div>
                      </div>

                      {/* Verified review snippet */}
                      {venue.snippets && venue.snippets.length > 0 && (
                        <div
                          className={`mt-3 p-2.5 rounded-lg border text-[11px] italic ${
                            isDark
                              ? 'bg-slate-950 border-slate-800/80 text-slate-400'
                              : 'bg-slate-50 border-slate-100 text-slate-600'
                          }`}
                        >
                          "{venue.snippets[0]}"
                        </div>
                      )}
                    </div>

                    {/* Google Maps link */}
                    <div
                      className={`mt-4 pt-3 border-t flex items-center justify-between ${
                        isDark ? 'border-slate-800/80' : 'border-slate-100'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Official Google Maps Pin
                      </span>
                      {venue.uri ? (
                        <a
                          href={venue.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-xs font-bold hover:underline ${
                            isDark ? 'text-[#ccff00]' : 'text-lime-700'
                          }`}
                        >
                          <span>Open Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-500">Verified Ground</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-8 text-xs text-slate-400">
                  Enter a city name above to scout verified sports facilities.
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};
