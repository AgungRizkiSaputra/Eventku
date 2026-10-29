'use client';

import { useState } from 'react';
import { AdminNav } from '@/components/admin/admin-nav';
import { CATEGORIES as INITIAL_CATEGORIES, MOCK_EVENTS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/types';
import { Plus, Check, Tag } from 'lucide-react';
import { slugify } from '@/lib/utils';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎟️');
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      slug: slugify(name.trim()),
      description: description.trim() || undefined,
      icon: icon || '🎟️',
    };

    setCategories([...categories, newCategory]);
    notify(`Kategori "${newCategory.name}" berhasil ditambahkan.`);
    setName('');
    setDescription('');
    setIcon('🎟️');
    setShowAddForm(false);
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-display-md">Kategori Acara</h1>
          <p className="text-body text-ink-muted mt-1">
            Kelola taksonomi kategori untuk mempermudah pencarian dan pengelompokan event.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" /> {showAddForm ? 'Tutup Formulir' : 'Tambah Kategori'}
        </Button>
      </div>

      <AdminNav />

      {notification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-body-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-success" />
          {notification}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddCategory} className="bg-ground border border-ground-subtle p-6 mb-8 max-w-xl">
          <h2 className="font-display font-bold text-body-lg text-ink mb-4">Buat Kategori Baru</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <Input
                  label="Icon/Emoji"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="🎵"
                  required
                />
              </div>
              <div className="col-span-3">
                <Input
                  label="Nama Kategori"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Teater & Seni Pertunjukan"
                  required
                />
              </div>
            </div>

            <Input
              label="Deskripsi Kategori"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat seputar kategori ini..."
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm">
                Simpan Kategori
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const eventCount = MOCK_EVENTS.filter((e) => e.category_id === cat.id).length;

          return (
            <div key={cat.id} className="bg-ground border border-ground-subtle p-5 hover:bg-ground-muted/30 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{cat.icon || '🎟️'}</span>
                  <div>
                    <h3 className="font-bold text-body text-ink">{cat.name}</h3>
                    <span className="font-mono text-caption text-ink-faint">/{cat.slug}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-ground-muted text-caption font-medium text-ink">
                  {eventCount} event
                </span>
              </div>

              {cat.description && (
                <p className="text-body-sm text-ink-muted mt-2 line-clamp-2">{cat.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

