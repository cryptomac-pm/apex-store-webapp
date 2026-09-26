import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopBySport } from './components/ShopBySport';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { VenueFinder } from './components/VenueFinder';
import { Footer } from './components/Footer';
import { PRODUCTS } from './data/products';
import { Product, CartItem, FilterState, SportCategory, KitSize, PlacedOrder, CurrencyCode } from './types';
import { Filter, X, CheckCircle2, ChevronRight, ShieldAlert, Globe } from 'lucide-react';
import { CURRENCIES, formatCurrency } from './utils/currency';
import { useTheme } from './context/ThemeContext';

const LOCAL_STORAGE_CART_KEY = 'apex_athletics_cart_v2';
const LOCAL_STORAGE_ORDERS_KEY = 'apex_athletics_orders_v2';
const LOCAL_STORAGE_CURRENCY_KEY = 'apex_athletics_currency_v2';

export default function App() {
  // Global Currency State persisted to localStorage
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);
      return (saved as CurrencyCode) || 'USD';
    } catch {
      return 'USD';
    }
  });

  // Cart state persisted to localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recent orders
  const [recentOrders, setRecentOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save currency to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, currentCurrency);
    } catch (e) {
      console.error('Failed to save currency', e);
    }
  }, [currentCurrency]);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Save orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(recentOrders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [recentOrders]);

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false);

  // Top banner dismissible state
  const [showTopBanner, setShowTopBanner] = useState(true);

  // Promo code
  const [appliedPromo, setAppliedPromo] = useState<string | null>('APEX15');

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    sport: 'All',
    brand: 'All',
    size: 'All',
    sortBy: 'featured',
    searchQuery: '',
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add to cart handler
  const handleAddToCart = (product: Product, size: KitSize) => {
    setCartItems((prevItems) => {
      const itemKey = `${product.id}-${size}`;
      const existing = prevItems.find((item) => item.id === itemKey);
      if (existing) {
        return prevItems.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem: CartItem = {
          id: itemKey,
          productId: product.id,
          name: product.name,
          sport: product.sport,
          price: product.price,
          image: product.image,
          size,
          quantity: 1,
        };
        return [...prevItems, newItem];
      }
    });

    showToast(`Added ${product.name} (${size}) to cart`);
  };

  // Cart item quantity update
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  // Remove from cart
  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Apply promo code logic
  const handleApplyPromo = (code: string) => {
    const upper = code.trim().toUpperCase();
    if (upper === 'APEX15') {
      setAppliedPromo('APEX15');
      return { success: true, message: '15% discount applied successfully!' };
    }
    if (upper === 'CHAMPION') {
      setAppliedPromo('CHAMPION');
      return { success: true, message: '$20 discount applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try APEX15 or CHAMPION.' };
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Checkout calculations in base USD
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalUSD = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let discountUSD = 0;
  if (appliedPromo === 'APEX15') {
    discountUSD = Math.round(subtotalUSD * 0.15 * 100) / 100;
  } else if (appliedPromo === 'CHAMPION') {
    discountUSD = Math.min(20, subtotalUSD);
  }
  const discountedSubtotalUSD = Math.max(0, subtotalUSD - discountUSD);
  const shippingUSD = discountedSubtotalUSD >= 100 || cartItems.length === 0 ? 0 : 12;
  const taxUSD = Math.round(discountedSubtotalUSD * 0.08 * 100) / 100;
  const finalTotalUSD = Math.round((discountedSubtotalUSD + shippingUSD + taxUSD) * 100) / 100;

  // Order completed
  const handleOrderCompleted = (newOrder: PlacedOrder) => {
    setRecentOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    // Filter by Sport / Category
    if (filters.sport !== 'All') {
      result = result.filter((p) => p.sport === filters.sport);
    }

    // Filter by Brand
    if (filters.brand && filters.brand !== 'All') {
      result = result.filter((p) => p.brand === filters.brand);
    }

    // Filter by Size
    if (filters.size !== 'All') {
      result = result.filter((p) => p.sizes.includes(filters.size as KitSize));
    }

    // Filter by Search Query
    if (filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sport.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.teamOrNation && p.teamOrNation.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.technology.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      sport: 'All',
      brand: 'All',
      size: 'All',
      sortBy: 'featured',
      searchQuery: '',
    });
  };

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCategories = () => {
    const el = document.getElementById('categories-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currencyConfig = CURRENCIES[currentCurrency] || CURRENCIES.USD;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col font-sans selection:bg-[#ccff00] selection:text-black ${
        isDark ? 'bg-[#0b0f17] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Promotional Top Banner (Slim, dismissible) */}
      {showTopBanner && (
        <div className="bg-[#ccff00] text-black px-4 py-2 text-xs font-bold flex items-center justify-between z-50">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-center truncate">
            <span className="bg-black text-[#ccff00] text-[10px] px-1.5 py-0.5 rounded font-black uppercase">
              GLOBAL DROPS
            </span>
            <span className="truncate">
              International kits, European club matchwear, & boots live! Use <span className="font-black underline">APEX15</span> for 15% off · Live {currencyConfig.code} pricing!
            </span>
          </div>
          <button
            onClick={() => setShowTopBanner(false)}
            className="p-1 hover:bg-black/10 rounded transition-colors text-black"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Bar Navigation with Currency Converter & Theme Switcher */}
      <Navbar
        totalCartItems={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        selectedSport={filters.sport}
        onSelectSport={(sport) => setFilters((prev) => ({ ...prev, sport }))}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        onNavigateHome={() => {
          handleResetFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentCurrency={currentCurrency}
        onSelectCurrency={setCurrentCurrency}
      />

      <main className="flex-1">
        {/* Hero Banner Section */}
        <Hero
          onShopLatest={scrollToCatalog}
          onExploreCategories={scrollToCategories}
        />

        {/* Shop By Sport & Collection Visual Category Grid */}
        <ShopBySport
          selectedSport={filters.sport}
          onSelectSport={(sport) => setFilters((prev) => ({ ...prev, sport }))}
        />

        {/* Currency Status Ribbon */}
        <div
          className={`border-y py-2.5 px-4 text-center text-xs transition-colors ${
            isDark
              ? 'bg-slate-900/60 border-slate-800/80 text-slate-300'
              : 'bg-lime-50/70 border-lime-200/80 text-slate-700'
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <Globe
              className={`w-3.5 h-3.5 ${
                isDark ? 'text-[#ccff00]' : 'text-lime-700'
              }`}
            />
            <span>
              Prices shown in{' '}
              <span
                className={`font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {currencyConfig.name} ({currencyConfig.code})
              </span>
              . Exchange rate: 1 USD = {currencyConfig.rate} {currencyConfig.code}. Real-time conversion enabled.
            </span>
          </div>
        </div>

        {/* Product Catalog & Filtering Section */}
        <section id="catalog-section" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div
                className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                  isDark ? 'text-[#ccff00]' : 'text-lime-700'
                }`}
              >
                Official Matchwear & Equipment
              </div>
              <h2
                className={`text-2xl sm:text-3xl lg:text-4xl font-black uppercase font-display ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {filters.sport === 'All'
                  ? 'FEATURED KITS, BOOTS & GEAR'
                  : `${filters.sport.toUpperCase()}`}
              </h2>
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setShowMobileFilterDrawer(!showMobileFilterDrawer)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-white hover:border-[#ccff00]'
                    : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400 shadow-xs'
                }`}
              >
                <Filter
                  className={`w-4 h-4 ${
                    isDark ? 'text-[#ccff00]' : 'text-lime-700'
                  }`}
                />
                <span>Filters & Sorting</span>
                {(filters.sport !== 'All' || filters.size !== 'All') && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDark ? 'bg-[#ccff00]' : 'bg-lime-600'
                    }`}
                  />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block lg:col-span-1 sticky top-24">
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                totalFiltered={filteredProducts.length}
                totalProducts={PRODUCTS.length}
              />
            </aside>

            {/* Mobile Collapsible Filter Drawer */}
            {showMobileFilterDrawer && (
              <div className="lg:hidden col-span-1 mb-4">
                <ProductFilters
                  filters={filters}
                  onFilterChange={(newFilters) => {
                    setFilters(newFilters);
                  }}
                  onResetFilters={handleResetFilters}
                  totalFiltered={filteredProducts.length}
                  totalProducts={PRODUCTS.length}
                />
              </div>
            )}

            {/* Product Cards Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Clean Brand Quick-Pills (Simple & Moderate) */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <span
                    className={`text-xs font-semibold mr-1 shrink-0 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Brand:
                  </span>
                  {['All', 'Nike', 'Adidas', 'Puma', 'Mizuno', 'Apex'].map((b) => {
                    const isSelected = (filters.brand || 'All') === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, brand: b }))
                        }
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all shrink-0 ${
                          isSelected
                            ? isDark
                              ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-xs'
                              : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : isDark
                            ? 'bg-slate-900/60 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-xs'
                        }`}
                      >
                        {b === 'All' ? 'All Brands' : b}
                      </button>
                    );
                  })}
                </div>

                <div
                  className={`text-xs font-medium shrink-0 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <span
                    className={`font-bold tabular-nums ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {filteredProducts.length}
                  </span>{' '}
                  available
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div
                  className={`py-20 px-4 text-center rounded-2xl border ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-800'
                      : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isDark
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3
                    className={`text-lg font-bold uppercase font-display ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    No Kits or Gear Found
                  </h3>
                  <p
                    className={`text-xs mt-1 max-w-sm mx-auto ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    We couldn't find any kits, boots, or trainers matching your filter criteria.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-5 px-5 py-2.5 rounded-lg bg-[#ccff00] text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onOpenQuickView={setQuickViewProduct}
                      currentCurrency={currentCurrency}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Technical Innovation Feature Spotlight */}
        <section
          className={`py-16 sm:py-20 border-y transition-colors ${
            isDark
              ? 'bg-slate-950 border-slate-800/80'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  isDark ? 'text-[#ccff00]' : 'text-lime-700'
                }`}
              >
                Material Science & Footwear Tech
              </span>
              <h2
                className={`text-2xl sm:text-4xl font-black uppercase font-display mt-1 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                ENGINEERED FOR PEAK ATHLETIC OUTPUT
              </h2>
              <p
                className={`text-xs sm:text-sm mt-2 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                From tournament-grade national jerseys to carbon-fiber propulsion cleat soleplates, every piece is tuned for explosive performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`p-6 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-slate-900/70 border-slate-800'
                    : 'bg-slate-50 border-slate-200 shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg mb-4 ${
                    isDark
                      ? 'bg-[#ccff00]/15 text-[#ccff00]'
                      : 'bg-lime-100 text-lime-700'
                  }`}
                >
                  01
                </div>
                <h3
                  className={`text-base font-bold uppercase tracking-wide ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Dual-Density Carbon Plate
                </h3>
                <p
                  className={`mt-2 text-xs leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Engineered into our Apex Phantom boots to deliver maximum kinetic snap and forward energy return during aggressive accelerations.
                </p>
              </div>

              <div
                className={`p-6 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-slate-900/70 border-slate-800'
                    : 'bg-slate-50 border-slate-200 shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg mb-4 ${
                    isDark
                      ? 'bg-[#ccff00]/15 text-[#ccff00]'
                      : 'bg-lime-100 text-lime-700'
                  }`}
                >
                  02
                </div>
                <h3
                  className={`text-base font-bold uppercase tracking-wide ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Tournament Jacquard ADV
                </h3>
                <p
                  className={`mt-2 text-xs leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Heat-mapped micro-rib textures on our country and club jerseys eliminate fabric cling even in 90+ minute high-humidity fixtures.
                </p>
              </div>

              <div
                className={`p-6 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-slate-900/70 border-slate-800'
                    : 'bg-slate-50 border-slate-200 shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg mb-4 ${
                    isDark
                      ? 'bg-[#ccff00]/15 text-[#ccff00]'
                      : 'bg-lime-100 text-lime-700'
                  }`}
                >
                  03
                </div>
                <h3
                  className={`text-base font-bold uppercase tracking-wide ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  NitroFuel™ Supercritical Foam
                </h3>
                <p
                  className={`mt-2 text-xs leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  Infused with inert nitrogen to provide 84% rebound efficiency across high-mileage road running and intense agility conditioning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Google Maps Grounded Turf & Court Finder Section */}
        <VenueFinder />
      </main>

      {/* Footer */}
      <Footer
        onSelectSport={(sport) => {
          setFilters((prev) => ({ ...prev, sport }));
        }}
      />

      {/* Gemini AI Multi-turn Chatbot with Maps Grounding */}
      <GeminiChatbot />

      {/* Cart Drawer with Currency Conversion */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
        currentCurrency={currentCurrency}
      />

      {/* Checkout Modal with Currency Conversion */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        subtotalUSD={subtotalUSD}
        discountUSD={discountUSD}
        shippingUSD={shippingUSD}
        taxUSD={taxUSD}
        finalTotalUSD={finalTotalUSD}
        currentCurrency={currentCurrency}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        currentCurrency={currentCurrency}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        recentOrders={recentOrders}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#ccff00] shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setIsCartOpen(true)}
              className="ml-2 text-[#ccff00] hover:underline flex items-center gap-0.5"
            >
              View Cart <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
