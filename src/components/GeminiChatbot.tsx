import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  MapPin,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  mapPlaces?: Array<{
    title: string;
    uri?: string;
    snippets?: string[];
  }>;
}

export type ModelTier = 'fast' | 'general' | 'complex';

export const GeminiChatbot: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [modelTier, setModelTier] = useState<ModelTier>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Initialize with welcome message from AI Coach
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: "Welcome, athlete! I'm your **Apex Technical Coach & Facilities Scout**. Ask me about international jerseys, European club kits, soccer boots, sizing advice, or ask me to **find local soccer pitches, basketball courts, and running tracks** using Google Maps!",
      timestamp: 'Just now',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.log('Location permission not granted or unavailable:', err.message);
        },
        { timeout: 8000 }
      );
    }
  }, []);

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          modelTier,
          userLocation,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Here is the technical information for your inquiry.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
        mapPlaces: data.mapPlaces,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ Apex Coach connection note: ${err.message || 'Unable to reach the Gemini server. Please check your network or try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        text: "Session cleared. What match kit, discipline, or sports ground can I assist you with today?",
        timestamp: 'Just now',
        modelUsed: 'gemini-3.5-flash',
      },
    ]);
  };

  const samplePrompts = [
    'Find soccer pitches near me',
    'Which kit is best for marathon running?',
    'Compare Brazil vs Argentina match kits',
    'Find public basketball courts nearby',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#ccff00] text-black font-extrabold shadow-2xl hover:bg-[#b8e600] active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ccff00] group"
        aria-label="Open Apex AI Coach & Facilities Scout"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 fill-black" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-[#ccff00] animate-pulse" />
        </div>
        <span className="text-xs uppercase tracking-wider hidden sm:inline">
          AI Kit Coach & Scout
        </span>
      </button>

      {/* Slide-Up / Popup Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[82vh] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200 border transition-colors ${
            isDark
              ? 'bg-[#0e131d] border-slate-700/80 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ccff00] flex items-center justify-center text-black font-black text-xs shadow-xs">
                ▲ AI
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Apex Technical Coach
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                    Online
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin
                    className={`w-3 h-3 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-600'
                    }`}
                  />
                  <span>Google Maps Grounded</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-black hover:bg-slate-200'
                }`}
                title="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-black hover:bg-slate-200'
                }`}
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Model Selector Bar */}
          <div
            className={`px-4 py-2 border-b flex items-center justify-between text-[11px] ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <span
              className={`font-medium ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Model Engine:
            </span>
            <div
              className={`flex items-center gap-1 p-0.5 rounded-lg border ${
                isDark
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-white border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setModelTier('fast')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  modelTier === 'fast'
                    ? 'bg-[#ccff00] text-black shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-black'
                }`}
                title="Fast response (gemini-3.1-flash-lite)"
              >
                Fast
              </button>
              <button
                type="button"
                onClick={() => setModelTier('general')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  modelTier === 'general'
                    ? 'bg-[#ccff00] text-black shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-black'
                }`}
                title="General & Maps Grounding (gemini-3.5-flash)"
              >
                General + Maps
              </button>
              <button
                type="button"
                onClick={() => setModelTier('complex')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  modelTier === 'complex'
                    ? 'bg-[#ccff00] text-black shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-black'
                }`}
                title="Deep Sports Science (gemini-3.1-pro-preview)"
              >
                Pro Deep
              </button>
            </div>
          </div>

          {/* Message Thread (Scrollable) */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-3.5 ${
              isDark ? 'bg-[#0b0f17]/50' : 'bg-slate-50/60'
            }`}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400">
                  <span>{msg.role === 'user' ? 'You' : 'Apex AI Coach'}</span>
                  <span>·</span>
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && (
                    <>
                      <span>·</span>
                      <span
                        className={`font-mono ${
                          isDark ? 'text-[#ccff00]' : 'text-lime-700'
                        }`}
                      >
                        {msg.modelUsed}
                      </span>
                    </>
                  )}
                </div>

                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#ccff00] text-black font-medium rounded-tr-none shadow-xs'
                      : isDark
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Render Google Maps Grounding Links and Venues if present */}
                  {msg.mapPlaces && msg.mapPlaces.length > 0 && (
                    <div
                      className={`mt-3 pt-2.5 border-t space-y-2 ${
                        isDark ? 'border-slate-800' : 'border-slate-100'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? 'text-[#ccff00]' : 'text-lime-700'
                        }`}
                      >
                        <Compass className="w-3 h-3" />
                        <span>Google Maps Grounded Locations ({msg.mapPlaces.length})</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {msg.mapPlaces.map((place, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg border transition-colors ${
                              isDark
                                ? 'bg-slate-950/80 border-slate-800 hover:border-[#ccff00]/50'
                                : 'bg-slate-50 border-slate-200 hover:border-lime-500'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className={`flex items-center gap-1.5 font-bold text-[11px] ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                <MapPin
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isDark ? 'text-[#ccff00]' : 'text-lime-600'
                                  }`}
                                />
                                <span className="line-clamp-1">{place.title}</span>
                              </div>
                              {place.uri && (
                                <a
                                  href={place.uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`hover:underline flex items-center gap-0.5 text-[10px] font-semibold shrink-0 ${
                                    isDark ? 'text-[#ccff00]' : 'text-lime-700'
                                  }`}
                                >
                                  <span>View on Maps</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>

                            {place.snippets && place.snippets.length > 0 && (
                              <div
                                className={`mt-1.5 text-[10px] italic p-1.5 rounded border ${
                                  isDark
                                    ? 'text-slate-400 bg-slate-900/60 border-slate-800/60'
                                    : 'text-slate-600 bg-white border-slate-200'
                                }`}
                              >
                                "{place.snippets[0]}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div
                className={`flex items-center gap-2 text-xs border rounded-xl px-3.5 py-2.5 w-fit ${
                  isDark
                    ? 'text-slate-400 bg-slate-900/80 border-slate-800'
                    : 'text-slate-600 bg-white border-slate-200 shadow-xs'
                }`}
              >
                <Sparkles
                  className={`w-3.5 h-3.5 animate-spin ${
                    isDark ? 'text-[#ccff00]' : 'text-lime-600'
                  }`}
                />
                <span>Coach is analyzing sports specs & facilities...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Pills */}
          <div
            className={`px-3 py-2 border-t overflow-x-auto flex gap-1.5 no-scrollbar ${
              isDark
                ? 'bg-slate-950/90 border-slate-800/80'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] border transition-colors disabled:opacity-50 ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-black border-slate-300 shadow-2xs'
                }`}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className={`p-3 border-t flex items-center gap-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask about kits, fabrics, or find local pitches..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors ${
                isDark
                  ? 'bg-slate-900 border border-slate-700/80 text-white placeholder:text-slate-500 focus:border-[#ccff00]'
                  : 'bg-slate-100 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-lime-600'
              }`}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 rounded-xl bg-[#ccff00] text-black hover:bg-[#b8e600] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
