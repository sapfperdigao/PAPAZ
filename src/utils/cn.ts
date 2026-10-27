import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Compose conditional class strings and resolve Tailwind conflicts (last wins).
// Used by the primitive kit for variant composition (DESIGN_PLAN §3.3).
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
