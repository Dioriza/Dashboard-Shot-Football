import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatDistance(meters: number): string {
  return `${meters.toFixed(1)}m`;
}

export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Simple color mappings for visualization
export function getEventColor(type: string): string {
  switch (type) {
    case 'goal': return '#E90052';
    case 'save': return '#0070F3';
    case 'block': return '#888888';
    case 'miss': return '#CCCCCC';
    case 'post': return '#FFA500';
    default: return '#333333';
  }
}
