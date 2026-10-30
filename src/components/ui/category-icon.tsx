import React from 'react';
import {
  Music,
  Tent,
  Mic,
  Wrench,
  Laptop,
  Palette,
  Trophy,
  Users,
  Ticket,
  Sparkles,
  Theater,
  Camera,
  Calendar,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  name?: string;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  // Direct icon keys
  music: Music,
  tent: Tent,
  mic: Mic,
  wrench: Wrench,
  laptop: Laptop,
  palette: Palette,
  trophy: Trophy,
  users: Users,
  ticket: Ticket,
  sparkles: Sparkles,
  theater: Theater,
  camera: Camera,
  calendar: Calendar,

  // Mappings by category slug / id / legacy emoji
  konser: Music,
  festival: Tent,
  seminar: Mic,
  workshop: Wrench,
  konferensi: Laptop,
  pameran: Palette,
  olahraga: Trophy,
  komunitas: Users,
  teater: Theater,
  fotografi: Camera,

  // Fallbacks for legacy emoji strings if any exist in storage
  '🎵': Music,
  '🎪': Tent,
  '🎤': Mic,
  '🛠': Wrench,
  '🛠️': Wrench,
  '📡': Laptop,
  '🖼': Palette,
  '🖼️': Palette,
  '⚽': Trophy,
  '👥': Users,
  '🎟️': Ticket,
  '🎟': Ticket,
};

export function CategoryIcon({ name = 'ticket', className = 'w-5 h-5' }: CategoryIconProps) {
  const normalizedKey = name.toLowerCase().trim();
  const IconComponent = ICON_MAP[normalizedKey] || Ticket;

  return <IconComponent className={cn('shrink-0', className)} strokeWidth={2} />;
}

