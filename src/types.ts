export type SportCategory =
  | 'Soccer'
  | 'Basketball'
  | 'Running'
  | 'Training'
  | 'International Kits'
  | 'Club Kits'
  | 'Boots & Footwear'
  | 'Tennis & Racquet';

export type ThemeMode = 'dark' | 'light';

export type KitSize =
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'US 8'
  | 'US 9'
  | 'US 10'
  | 'US 11'
  | 'US 12';

export type ProductType = 'jersey' | 'kit' | 'boots' | 'trainers' | 'apparel';

export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'NGN'
  | 'BRL'
  | 'INR'
  | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number; // against 1 USD
  flag: string;
  decimals: number;
}

export interface Product {
  id: string;
  name: string;
  brand?: string; // e.g. 'Nike' | 'Adidas' | 'Puma' | 'Mizuno' | 'Apex'
  sport: SportCategory;
  productType: ProductType;
  teamOrNation?: string;
  price: number; // in USD standard base price
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  technology: string[];
  sizes: KitSize[];
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand?: string;
  sport: SportCategory;
  price: number; // base USD
  image: string;
  size: KitSize;
  quantity: number;
}

export interface FilterState {
  sport: SportCategory | 'All';
  brand?: string | 'All';
  size: KitSize | 'All';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';
  searchQuery: string;
  productType?: ProductType | 'All';
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'applepay' | 'cod';
}

export interface PlacedOrder {
  orderId: string;
  date: string;
  items: CartItem[];
  currency: CurrencyCode;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingDetails: ShippingDetails;
}
