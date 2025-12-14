'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Globe, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { getCategoryLabel, getCountryFlag } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  targetMarkets: { countryCode: string; countryName: string }[];
  _count: { gaps: number; checklistItems: number };
}

// Sample products data (same as API)
const productsData: Product[] = [
  {
    id: '1',
    name: 'Kopi Arabika Gayo',
    description: 'Kopi premium dari dataran tinggi Gayo, Aceh. Single origin dengan profil rasa fruity dan wine-like.',
    category: 'FOOD',
    targetMarkets: [
      { countryCode: 'US', countryName: 'Amerika Serikat' },
      { countryCode: 'JP', countryName: 'Jepang' },
    ],
    _count: { gaps: 2, checklistItems: 5 },
  },
  {
    id: '2',
    name: 'Batik Tulis Solo',
    description: 'Batik tulis tradisional dengan motif klasik Parang dan Kawung. Pewarna alami.',
    category: 'APPAREL',
    targetMarkets: [
      { countryCode: 'SG', countryName: 'Singapura' },
      { countryCode: 'JP', countryName: 'Jepang' },
    ],
    _count: { gaps: 1, checklistItems: 3 },
  },
  {
    id: '3',
    name: 'Minyak Kelapa VCO',
    description: 'Virgin Coconut Oil organik dari Sulawesi. Cold-pressed, unrefined.',
    category: 'FOOD',
    targetMarkets: [
      { countryCode: 'AU', countryName: 'Australia' },
      { countryCode: 'DE', countryName: 'Jerman' },
    ],
    _count: { gaps: 3, checklistItems: 6 },
  },
  {
    id: '4',
    name: 'Skincare Bali Alus',
    description: 'Rangkaian skincare dengan bahan alami Bali - lulur, masker, dan body butter.',
    category: 'COSMETICS',
    targetMarkets: [
      { countryCode: 'KR', countryName: 'Korea Selatan' },
      { countryCode: 'CN', countryName: 'Tiongkok' },
    ],
    _count: { gaps: 4, checklistItems: 8 },
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          // Fallback to local data
          const found = productsData.find((p) => p.id === params.id);
          setProduct(found || null);
        }
      } catch (error) {
        // Fallback to local data on error
        const found = productsData.find((p) => p.id === params.id);
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12 text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Produk
        </Link>
        <Card className="py-12">
          <CardContent className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Produk tidak ditemukan</h3>
            <p className="text-muted-foreground mb-6">Produk yang Anda cari tidak ada atau sudah dihapus.</p>
            <Link href="/products"><Button>Lihat Semua Produk</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Produk
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
              </div>
              <CardTitle className="text-2xl mt-2">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
          </Card>

          {/* Target Markets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Target Pasar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.targetMarkets.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {product.targetMarkets.map((market) => (
                    <div key={market.countryCode} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="text-2xl">{getCountryFlag(market.countryCode)}</span>
                      <div>
                        <p className="font-medium">{market.countryName}</p>
                        <p className="text-sm text-muted-foreground">Lihat persyaratan →</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">Belum ada target pasar</p>
                  <Button variant="outline"><Plus className="h-4 w-4 mr-2" />Tambah Target Pasar</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Gap Analysis
              </CardTitle>
              <CardDescription>Kesenjangan yang perlu diperbaiki untuk ekspor</CardDescription>
            </CardHeader>
            <CardContent>
              {product._count.gaps > 0 ? (
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg border-orange-200 bg-orange-50">
                    <p className="font-medium text-orange-800">FDA Registration Required</p>
                    <p className="text-sm text-orange-600">Fasilitas produksi perlu terdaftar di FDA untuk ekspor ke AS</p>
                  </div>
                  <div className="p-3 border rounded-lg border-yellow-200 bg-yellow-50">
                    <p className="font-medium text-yellow-800">Nutrition Label Format</p>
                    <p className="text-sm text-yellow-600">Label nutrisi perlu disesuaikan dengan format FDA</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                  <p className="text-muted-foreground">Tidak ada gap teridentifikasi</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Pasar</span>
                <span className="font-medium">{product.targetMarkets.length} negara</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gap Teridentifikasi</span>
                <span className="font-medium text-warning">{product._count.gaps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Checklist Items</span>
                <span className="font-medium">{product._count.checklistItems}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Analisis Kesiapan</Button>
              <Button variant="outline" className="w-full">Export Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
