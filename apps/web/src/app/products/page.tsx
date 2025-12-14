'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Search, Filter, ArrowRight, AlertTriangle } from 'lucide-react';
import { fetcher, getCategoryLabel, getCountryFlag } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  targetMarkets: { countryCode: string; countryName: string }[];
  _count: { gaps: number; checklistItems: number };
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    fetcher<Product[]>('/api/products').then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return (categoryFilter === 'all' || p.category === categoryFilter) && matchSearch;
  });

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Produk Saya</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Kelola produk dan evaluasi kesiapan ekspor</p>
        </div>
        <Link href="/products/new" className="w-full sm:w-auto">
          <Button className="gap-2 w-full sm:w-auto"><Plus className="h-4 w-4" />Tambah Produk</Button>
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="FOOD">Makanan</SelectItem>
            <SelectItem value="COSMETICS">Kosmetik</SelectItem>
            <SelectItem value="APPAREL">Pakaian</SelectItem>
            <SelectItem value="HANDICRAFT">Kerajinan</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Memuat produk...</div>
      ) : filtered.length === 0 ? (
        <Card className="py-12"><CardContent className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{products.length === 0 ? 'Belum ada produk' : 'Tidak ditemukan'}</h3>
          {products.length === 0 && <Link href="/products/new"><Button>Tambah Produk</Button></Link>}
        </CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link key={p.id} href={/products/+p.id}>
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary">{getCategoryLabel(p.category)}</Badge>
                    {p._count.gaps > 0 && <div className="flex items-center gap-1 text-orange-500 text-sm"><AlertTriangle className="h-4 w-4" />{p._count.gaps}</div>}
                  </div>
                  <CardTitle className="mt-2">{p.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{p.description || 'Tidak ada deskripsi'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">{p.targetMarkets.length > 0 ? p.targetMarkets.map((m) => <span key={m.countryCode}>{getCountryFlag(m.countryCode)}</span>) : <span className="text-sm text-muted-foreground">Belum ada target</span>}</div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-12 text-center text-muted-foreground">Memuat...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
