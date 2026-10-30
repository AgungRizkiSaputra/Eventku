'use client';

import { useState } from 'react';
import { AdminNav } from '@/components/admin/admin-nav';
import { useAppContext } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { CategoryIcon } from '@/components/ui/category-icon';
import { Plus, Check, Trash2 } from 'lucide-react';
import { slugify } from '@/lib/utils';

const AVAILABLE_ICONS = [
  { value: 'music', label: 'Music (Musik / Konser)' },
  { value: 'tent', label: 'Tent (Festival / Outdoor)' },
  { value: 'mic', label: 'Mic (Seminar / Podcast)' },
  { value: 'wrench', label: 'Wrench (Workshop / Pelatihan)' },
  { value: 'laptop', label: 'Laptop (Konferensi / Teknologi)' },
  { value: 'palette', label: 'Palette (Pameran / Seni)' },
  { value: 'trophy', label: 'Trophy (Olahraga / Kompetisi)' },
  { value: 'users', label: 'Users (Komunitas / Meetup)' },
  { value: 'theater', label: 'Theater (Teater / Pertunjukan)' },
  { value: 'camera', label: 'Camera (Fotografi / Media)' },
  { value: 'sparkles', label: 'Sparkles (Spesial / Populer)' },
  { value: 'ticket', label: 'Ticket (Umum / Tiket)' },
];

export default function AdminCategoriesPage() {
  const { categories, addCategory, deleteCategory, events } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('ticket');
  const [showAddForm, setShowAddForm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const created = addCategory({
      name: name.trim(),
      slug: slugify(name.trim()),
      description: description.trim() || undefined,
      icon,
    });

    notify(`Kategori "${created.name}" berhasil ditambahkan dan langsung aktif di katalog website.`);
    setName('');
    setDescription('');
    setIcon('ticket');
    setShowAddForm(false);
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Yakin ingin menghapus kategori "${catName}"?`)) {
      deleteCategory(id);
      notify(`Kategori "${catName}" telah dihapus.`);
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-section page-padding max-w-wide mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-display-md">Kategori Acara</h1>
          <p className="text-body text-ink-muted mt-1">
            Kelola taksonomi kategori. Kategori yang dibuat di sini langsung muncul di homepage dan filter pencarian.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" /> {showAddForm ? 'Tutup Formulir' : 'Tambah Kategori Baru'}
        </Button>
      </div>

      <AdminNav />

      {notification && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-body-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-success" />
          <span>{notification}</span>
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddCategory} className="bg-ground border border-ground-subtle p-6 mb-8 max-w-xl">
          <h2 className="font-display font-bold text-body-lg text-ink mb-4">Buat Kategori Acara Baru</h2>
          <div className="space-y-4">
            <Input
              label="Nama Kategori"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Teater & Seni Pertunjukan"
              required
            />

            <Select
              label="Pilih SVG Icon (Bukan Emot)"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              options={AVAILABLE_ICONS}
            />

            <div className="flex items-center gap-3 p-3 bg-ground-muted border border-ground-subtle">
              <span className="text-caption text-ink-muted">Pratinjau Icon:</span>
              <div className="w-8 h-8 bg-ink text-ground flex items-center justify-center">
                <CategoryIcon name={icon} className="w-4 h-4" />
              </div>
              <span className="text-body-sm font-medium text-ink capitalize">{icon}</span>
            </div>

            <Input
              label="Deskripsi Kategori"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat seputar kelompok event ini..."
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm">
                Simpan & Terbitkan Kategori
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const eventCount = events.filter((e) => e.category_id === cat.id).length;

          return (
            <div key={cat.id} className="bg-ground border border-ground-subtle p-5 hover:bg-ground-muted/30 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ground-muted border border-ground-subtle flex items-center justify-center text-accent">
                      <CategoryIcon name={cat.icon} className="w-5 h-5" />
                    </div>
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

              <div className="mt-4 pt-3 border-t border-ground-subtle flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-caption text-error hover:text-error/80 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
