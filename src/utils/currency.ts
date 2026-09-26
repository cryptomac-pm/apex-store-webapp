import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1.0,
    flag: '🇺🇸',
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rate: 0.92,
    flag: '🇪🇺',
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rate: 0.78,
    flag: '🇬🇧',
    decimals: 2,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    rate: 1.36,
    flag: '🇨🇦',
    decimals: 2,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rate: 1.52,
    flag: '🇦🇺',
    decimals: 2,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    rate: 154.0,
    flag: '🇯🇵',
    decimals: 0,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    rate: 1485.0,
    flag: '🇳🇬',
    decimals: 0,
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    rate: 5.42,
    flag: '🇧🇷',
    decimals: 2,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    rate: 83.6,
    flag: '🇮🇳',
    decimals: 2,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    rate: 3.67,
    flag: '🇦🇪',
    decimals: 2,
  },
};

/**
 * Converts a base USD amount to the selected currency
 */
export function convertPrice(amountInUSD: number, currency: CurrencyCode): number {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountInUSD * config.rate;
  if (config.decimals === 0) {
    return Math.round(converted);
  }
  return Math.round(converted * 100) / 100;
}

/**
 * Formats a base USD amount directly into the localized currency string with symbol
 */
export function formatCurrency(amountInUSD: number, currency: CurrencyCode): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const value = convertPrice(amountInUSD, currency);

  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(value);

  return `${config.symbol}${formattedNum}`;
}
