import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  });
}

export function formatTime(timeString: string): string {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (startDate.toDateString() === endDate.toDateString()) {
    return formatDate(start);
  }

  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`;
  }

  return `${formatDateShort(start)} – ${formatDateShort(end)} ${endDate.getFullYear()}`;
}

export function generateOrderCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'EVT-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateTicketCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'TIX-';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateQRData(ticketCode: string, eventId: string): string {
  const payload = {
    code: ticketCode,
    event: eventId,
    ts: Date.now(),
    v: 1,
  };
  return btoa(JSON.stringify(payload));
}

export function getEventStatus(event: { start_date: string; end_date: string; status: string }): 'upcoming' | 'ongoing' | 'past' | 'cancelled' {
  if (event.status === 'cancelled') return 'cancelled';

  const now = new Date();
  const start = new Date(event.start_date);
  const end = new Date(event.end_date);

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'past';
}

export function getTicketAvailability(ticketType: { quota: number; sold: number; sale_start: string; sale_end: string }): 'available' | 'sold_out' | 'not_started' | 'ended' {
  const now = new Date();
  const saleStart = new Date(ticketType.sale_start);
  const saleEnd = new Date(ticketType.sale_end);

  if (now < saleStart) return 'not_started';
  if (now > saleEnd) return 'ended';
  if (ticketType.sold >= ticketType.quota) return 'sold_out';
  return 'available';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

export function getDaysUntil(dateString: string): number {
  const now = new Date();
  const target = new Date(dateString);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getRelativeTime(dateString: string): string {
  const days = getDaysUntil(dateString);
  if (days < 0) return 'Sudah lewat';
  if (days === 0) return 'Hari ini';
  if (days === 1) return 'Besok';
  if (days < 7) return `${days} hari lagi`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lagi`;
  if (days < 365) return `${Math.floor(days / 30)} bulan lagi`;
  return `${Math.floor(days / 365)} tahun lagi`;
}

