import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, ArrowLeft, PackageCheck } from 'lucide-react';
import { CartItem, ShippingDetails, PlacedOrder, CurrencyCode } from '../types';
import { formatCurrency, CURRENCIES } from '../utils/currency';
import { useTheme } from '../context/ThemeContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  subtotalUSD: number;
  discountUSD: number;
  shippingUSD: number;
  taxUSD: number;
  finalTotalUSD: number;
  currentCurrency: CurrencyCode;
  onOrderCompleted: (order: PlacedOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  subtotalUSD,
  discountUSD,
  shippingUSD,
  taxUSD,
  finalTotalUSD,
  currentCurrency,
  onOrderCompleted,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);

  const currencyInfo = CURRENCIES[currentCurrency] || CURRENCIES.USD;

  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: 'Alex Vance',
    email: 'alex.vance@apexclub.com',
    address: '742 Evergreen Athletic Blvd, Suite 400',
    city: 'Seattle',
    postalCode: '98101',
    country: 'United States',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
  });

  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('892');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const randomOrderId = `APX-${Math.floor(100000 + Math.random() * 900000)}`;
      const order: PlacedOrder = {
        orderId: randomOrderId,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        items: [...cartItems],
        currency: currentCurrency,
        subtotal: subtotalUSD,
        discount: discountUSD,
        shipping: shippingUSD,
        tax: taxUSD,
        total: finalTotalUSD,
        shippingDetails: { ...formData },
      };
      setConfirmedOrder(order);
      setStep('confirmed');
      onOrderCompleted(order);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => {
          if (step !== 'confirmed') onClose();
        }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 my-8 border transition-colors ${
          isDark
            ? 'bg-[#0e131d] border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Top Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isDark ? 'bg-[#ccff00]' : 'bg-lime-500'
              }`}
            />
            <h3
              className={`text-base font-black uppercase font-display tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {step === 'confirmed' ? 'ORDER CONFIRMATION' : 'SECURE ATHLETIC CHECKOUT'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                isDark
                  ? 'text-slate-300 bg-slate-900 border-slate-700'
                  : 'text-slate-700 bg-white border-slate-200 shadow-xs'
              }`}
            >
              {currencyInfo.flag} {currencyInfo.code}
            </span>
            {step !== 'confirmed' && (
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
            )}
          </div>
        </div>

        {/* Step 1: Shipping Details */}
        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="p-6 sm:p-8 space-y-5">
            <div
              className={`flex items-center justify-between pb-2 border-b text-xs font-bold uppercase tracking-wider ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}
            >
              <span>Step 1 of 2: Delivery & Athlete Info</span>
              <span className={isDark ? 'text-[#ccff00]' : 'text-lime-700'}>
                Exact Currency: {currencyInfo.code}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Full Name / Athlete Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white focus:border-[#ccff00]'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-lime-600'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Email Address (for dispatch tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white focus:border-[#ccff00]'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-lime-600'
                  }`}
                />
              </div>
            </div>

            <div>
              <label
                className={`block text-xs font-semibold mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${
                  isDark
                    ? 'bg-slate-900 border border-slate-700 text-white focus:border-[#ccff00]'
                    : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-lime-600'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label
                  className={`block text-xs font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white focus:border-[#ccff00]'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-lime-600'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`block text-xs font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    isDark
                      ? 'bg-slate-900 border border-slate-700 text-white focus:border-[#ccff00]'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 focus:border-lime-600'
                  }`}
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label
                  className={`block text-xs font-semibold mb-1 ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}
                >
                  Destination Country
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.country}
                  className={`w-full rounded-lg px-3 py-2 text-sm cursor-not-allowed ${
                    isDark
                      ? 'bg-slate-950 border border-slate-800 text-slate-400'
                      : 'bg-slate-100 border border-slate-200 text-slate-500'
                  }`}
                />
              </div>
            </div>

            {/* Delivery Option */}
            <div className="space-y-2 pt-2">
              <label
                className={`block text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Delivery Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    formData.deliveryMethod === 'standard'
                      ? isDark
                        ? 'border-[#ccff00] bg-slate-900/90'
                        : 'border-lime-500 bg-lime-50/50'
                      : isDark
                      ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Truck
                      className={`w-4 h-4 ${
                        isDark ? 'text-[#ccff00]' : 'text-lime-600'
                      }`}
                    />
                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Standard Tracked
                      </div>
                      <div className="text-[11px] text-slate-400">3-5 business days</div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-700'
                    }`}
                  >
                    {shippingUSD === 0 ? 'FREE' : formatCurrency(shippingUSD, currentCurrency)}
                  </span>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, deliveryMethod: 'express' })}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    formData.deliveryMethod === 'express'
                      ? isDark
                        ? 'border-[#ccff00] bg-slate-900/90'
                        : 'border-lime-500 bg-lime-50/50'
                      : isDark
                      ? 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <PackageCheck
                      className={`w-4 h-4 ${
                        isDark ? 'text-[#ccff00]' : 'text-lime-600'
                      }`}
                    />
                    <div>
                      <div
                        className={`text-xs font-bold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Match Priority Dispatch
                      </div>
                      <div className="text-[11px] text-slate-400">1-2 business days</div>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    +{formatCurrency(8, currentCurrency)}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`pt-4 border-t flex items-center justify-between ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className={`text-xs font-semibold ${
                  isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Back to Cart
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-[#ccff00] text-black font-extrabold uppercase text-xs tracking-wider hover:bg-[#b8e600] transition-colors shadow-xs"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-5">
            <div
              className={`flex items-center justify-between pb-2 border-b text-xs font-bold uppercase tracking-wider ${
                isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}
            >
              <button
                type="button"
                onClick={() => setStep('details')}
                className={`flex items-center gap-1 transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-black'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping
              </button>
              <span>Step 2 of 2: Payment in {currencyInfo.code}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label
                className={`block text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                    formData.paymentMethod === 'card'
                      ? isDark
                        ? 'border-[#ccff00] bg-slate-900 text-white'
                        : 'border-slate-900 bg-slate-900 text-white'
                      : isDark
                      ? 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <CreditCard
                    className={`w-4 h-4 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-400'
                    }`}
                  />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'applepay' })}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                    formData.paymentMethod === 'applepay'
                      ? isDark
                        ? 'border-[#ccff00] bg-slate-900 text-white'
                        : 'border-slate-900 bg-slate-900 text-white'
                      : isDark
                      ? 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-400'
                    }`}
                  />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                    formData.paymentMethod === 'cod'
                      ? isDark
                        ? 'border-[#ccff00] bg-slate-900 text-white'
                        : 'border-slate-900 bg-slate-900 text-white'
                      : isDark
                      ? 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Truck
                    className={`w-4 h-4 ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-400'
                    }`}
                  />
                  <span>Pay on Delivery</span>
                </button>
              </div>
            </div>

            {formData.paymentMethod === 'card' && (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isDark
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 text-xs font-mono focus:outline-none ${
                      isDark
                        ? 'bg-slate-900 border border-slate-700 text-white'
                        : 'bg-white border border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 text-xs font-mono focus:outline-none ${
                        isDark
                          ? 'bg-slate-900 border border-slate-700 text-white'
                          : 'bg-white border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 text-xs font-mono focus:outline-none ${
                        isDark
                          ? 'bg-slate-900 border border-slate-700 text-white'
                          : 'bg-white border border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'cod' && (
              <div
                className={`p-4 rounded-xl border text-xs ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div
                  className={`font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Cash on Delivery (COD) Selected
                </div>
                <p className="text-slate-400">
                  You will pay upon delivery at {formData.address}. The exact amount due is{' '}
                  <span
                    className={`font-bold ${
                      isDark ? 'text-[#ccff00]' : 'text-lime-700'
                    }`}
                  >
                    {formatCurrency(finalTotalUSD, currentCurrency)}
                  </span>.
                </p>
              </div>
            )}

            {/* Order Brief Summary in Selected Currency */}
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
                <span
                  className={`tabular-nums ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {formatCurrency(subtotalUSD, currentCurrency)}
                </span>
              </div>
              {discountUSD > 0 && (
                <div className="flex justify-between text-emerald-500">
                  <span>Discount</span>
                  <span className="tabular-nums">
                    -{formatCurrency(discountUSD, currentCurrency)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Shipping & Handling
                </span>
                <span
                  className={`tabular-nums ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {shippingUSD === 0 ? 'FREE' : formatCurrency(shippingUSD, currentCurrency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Estimated Sales Tax
                </span>
                <span
                  className={`tabular-nums ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {formatCurrency(taxUSD, currentCurrency)}
                </span>
              </div>
              <div
                className={`pt-2 border-t flex justify-between font-bold text-sm ${
                  isDark
                    ? 'border-slate-800 text-white'
                    : 'border-slate-200 text-slate-900'
                }`}
              >
                <span>Total Due ({currencyInfo.code})</span>
                <span
                  className={`font-display text-base tabular-nums ${
                    isDark ? 'text-[#ccff00]' : 'text-lime-700'
                  }`}
                >
                  {formatCurrency(finalTotalUSD, currentCurrency)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-lg bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ccff00]/20 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="animate-pulse">Authorizing Matchwear Order...</span>
              ) : (
                <span>
                  Authorize & Place Order ({formatCurrency(finalTotalUSD, currentCurrency)})
                </span>
              )}
            </button>
          </form>
        )}

        {/* Step 3: Order Confirmation */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div
              className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto animate-in zoom-in duration-300 ${
                isDark
                  ? 'bg-[#ccff00]/15 border-[#ccff00] text-[#ccff00]'
                  : 'bg-lime-100 border-lime-500 text-lime-700'
              }`}
            >
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div
                className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                  isDark ? 'text-[#ccff00]' : 'text-lime-700'
                }`}
              >
                Order Confirmed · Preparing Shipment
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-black uppercase font-display ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                THANK YOU FOR GEARING UP, {confirmedOrder.shippingDetails.fullName.split(' ')[0]}!
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Order{' '}
                <span
                  className={`font-mono font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {confirmedOrder.orderId}
                </span>{' '}
                has been routed to our technical apparel dispatch center.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div
              className={`border rounded-xl p-4 text-left text-xs space-y-3 ${
                isDark
                  ? 'bg-slate-950 border-slate-800'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div
                className={`flex justify-between items-center pb-2 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <span className="text-slate-400">Recipient</span>
                <span
                  className={`font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {confirmedOrder.shippingDetails.fullName}
                </span>
              </div>
              <div
                className={`flex justify-between items-center pb-2 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <span className="text-slate-400">Ship To</span>
                <span
                  className={`text-right truncate max-w-xs ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {confirmedOrder.shippingDetails.address}, {confirmedOrder.shippingDetails.city}
                </span>
              </div>
              <div
                className={`flex justify-between items-center pb-2 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <span className="text-slate-400">Payment Status</span>
                <span
                  className={`font-bold uppercase ${
                    isDark ? 'text-[#ccff00]' : 'text-lime-700'
                  }`}
                >
                  {confirmedOrder.shippingDetails.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Paid in Full'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 font-bold text-sm">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  Exact Amount Charged
                </span>
                <span
                  className={`font-display text-base tabular-nums ${
                    isDark ? 'text-[#ccff00]' : 'text-lime-700'
                  }`}
                >
                  {formatCurrency(confirmedOrder.total, confirmedOrder.currency)}
                </span>
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-lg bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold uppercase text-xs tracking-wider transition-colors shadow-xs"
            >
              Continue Exploring Apex Gear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
