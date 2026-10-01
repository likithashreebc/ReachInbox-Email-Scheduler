import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return `Today, ${format(d, 'h:mm a')}`;
  if (isYesterday(d)) return `Yesterday, ${format(d, 'h:mm a')}`;
  return format(d, 'MMM d, h:mm a');
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFullDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy · h:mm a');
}

export function parseEmailsFromText(text: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  const matches = text.match(emailRegex) ?? [];
  return [...new Set(matches.map((e) => e.toLowerCase()))];
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export function pluralize(count: number, word: string): string {
  return `${count.toLocaleString()} ${word}${count !== 1 ? 's' : ''}`;
}
