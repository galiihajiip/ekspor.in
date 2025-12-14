import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Use local API routes (no external backend needed)
export const API_URL = '';

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error('API request failed');
  }

  return res.json();
}

export function getSeverityColor(severity: string) {
  switch (severity) {
    case 'CRITICAL':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'HIGH':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'LOW':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    FOOD: 'Makanan',
    COSMETICS: 'Kosmetik',
    APPAREL: 'Pakaian',
    HANDICRAFT: 'Kerajinan',
  };
  return labels[category] || category;
}

export function getCountryFlag(code: string) {
  const flags: Record<string, string> = {
    US: '🇺🇸',
    JP: '🇯🇵',
    SG: '🇸🇬',
  };
  return flags[code] || '🌍';
}
