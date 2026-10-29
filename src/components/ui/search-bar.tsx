'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  large?: boolean;
}

export function SearchBar({ defaultValue = '', placeholder = 'Cari event, artis, atau kota...', className, large }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/events?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search
        className={cn(
          'absolute left-0 top-1/2 -translate-y-1/2 text-ink-muted',
          large ? 'w-6 h-6' : 'w-5 h-5',
        )}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-transparent border-b-2 border-ink/20 text-ink placeholder:text-ink-faint',
          'focus:outline-none focus:border-ink transition-colors duration-200',
          large ? 'pl-10 pr-4 py-4 text-body-lg' : 'pl-8 pr-4 py-3 text-body',
        )}
      />
    </form>
  );
}

