import React, { useState } from 'react';
import { X, Award, Sparkles } from 'lucide-react';
import { PlacedOrder } from '../types';
import { formatCurrency } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentOrders: PlacedOrder[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  recentOrders,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10 my-8 border transition-colors ${
          isDark
            ? 'bg-[#0e131d] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ccff00] text-black font-black flex items-center justify-center text-sm shadow-xs">
              AV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-base font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Alex Vance
                </h3>
                <span
                  className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                    isDark
                      ? 'bg-[#ccff00]/20 text-[#ccff00]'
                      : 'bg-lime-100 text-lime-800'
                  }`}
                >
                  PRO TIER
                </span>
              </div>
              <p className="text-xs text-slate-400">alex.vance@apexclub.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-black hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className={`flex border-b px-6 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 mr-6 transition-colors ${
              activeTab === 'profile'
                ? isDark
                  ? 'border-[#ccff00] text-[#ccff00]'
                  : 'border-lime-600 text-lime-700'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Athlete Account
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? isDark
                  ? 'border-[#ccff00] text-[#ccff00]'
                  : 'border-lime-600 text-lime-700'
                : isDark
                ? 'border-transparent text-slate-400 hover:text-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>Orders</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
                isDark
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {recentOrders.length + 1}
            </span>
          </button>
        </div>

        {/* Tab 1: Profile Details */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-5">
            <div
              className={`p-4 rounded-xl border space-y-2 ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Apex Membership
                </span>
                <span
                  className={`font-bold ${
                    isDark ? 'text-[#ccff00]' : 'text-lime-700'
                  }`}
                >
                  Gold Pro Level
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Member Since
                </span>
                <span
                  className={`font-semibold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  August 2024
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Default Kit Size
                </span>
                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    isDark
                      ? 'text-white bg-slate-800'
                      : 'text-slate-900 bg-slate-200'
                  }`}
                >
                  L (Large)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Pro Perks Active
              </div>
              <div className="space-y-1.5 text-xs">
                <div
                  className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Award
                    className={`w-4 h-4 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-600'
                    }`}
                  />
                  <span>Free Express Shipping on all matchwear orders</span>
                </div>
                <div
                  className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Sparkles
                    className={`w-4 h-4 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-600'
                    }`}
                  />
                  <span>Early 48-hour access to tournament drop releases</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className={`w-full py-2.5 rounded-lg border text-xs font-bold transition-colors ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                }`}
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {recentOrders.length > 0 &&
              recentOrders.map((order) => (
                <div
                  key={order.orderId}
                  className={`p-4 rounded-xl border space-y-2 text-xs ${
                    isDark
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-mono font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {order.orderId}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isDark
                          ? 'text-[#ccff00] bg-[#ccff00]/10'
                          : 'text-lime-800 bg-lime-100'
                      }`}
                    >
                      In Fulfillment
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{order.date}</div>
                  <div
                    className={`pt-2 border-t flex justify-between font-medium ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      {order.items.length} item(s)
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {formatCurrency(order.total, order.currency || 'USD')}
                    </span>
                  </div>
                </div>
              ))}

            {/* Default mock past order */}
            <div
              className={`p-4 rounded-xl border space-y-2 text-xs ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800/80'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`font-mono font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  APX-491028
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                  Delivered
                </span>
              </div>
              <div className="text-slate-400 text-[11px]">Sept 12, 2026</div>
              <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                Brazil National Team Match Jersey (Size L)
              </div>
              <div
                className={`pt-2 border-t flex justify-between font-medium ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <span className="text-slate-400">Paid with Card</span>
                <span
                  className={`font-bold tabular-nums ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  $140.00
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
