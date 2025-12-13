'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Package } from 'lucide-react';
import { fetcher } from '@/lib/utils';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', hsCode: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      setError('Nama produk dan kategori wajib diisi');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const product = await fetcher<{ id: string }>('/api/products', {
        method: 'POST',
        body: JSON.stringify({ ...form, userId: 'demo-user' }),
      });
      router.push(`/products/${product.id}`);
    } catch (err) {
      setError('Gagal membuat produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-2xl">
      <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Produk
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Tambah Produk Baru
          </CardTitle>
          <CardDescription>Daftarkan produk Anda untuk evaluasi kesiapan ekspor</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input id="name" placeholder="Contoh: Kopi Arabika Gayo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <textarea id="description" className="w-full h-24 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Deskripsi singkat produk Anda..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Kategori Produk *</Label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOOD">Makanan & Minuman</SelectItem>
                  <SelectItem value="COSMETICS">Kosmetik & Perawatan</SelectItem>
                  <SelectItem value="APPAREL">Pakaian & Tekstil</SelectItem>
                  <SelectItem value="HANDICRAFT">Kerajinan Tangan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hsCode">Kode HS (opsional)</Label>
              <Input id="hsCode" placeholder="Contoh: 0901.21" value={form.hsCode} onChange={(e) => setForm({ ...form, hsCode: e.target.value })} />
              <p className="text-xs text-muted-foreground">Kode Harmonized System untuk klasifikasi produk ekspor</p>
            </div>

            {error && <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">{error}</div>}

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : 'Simpan Produk'}
              </Button>
              <Link href="/products"><Button type="button" variant="outline">Batal</Button></Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
