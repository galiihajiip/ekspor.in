'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, Globe, FileCheck, TrendingUp, Plus, ArrowRight, AlertTriangle } from 'lucide-react';
import { fetcher, getCategoryLabel, getCountryFlag, getScoreColor } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  targetMarkets: { countryCode: string; countryName: string }[];
  _count: { gaps: number; checklistItems: number };
}

interface MarketSignal {
  id: string;
  countryCode: string;
  countryName: string;
  category: string;
  demandOverview: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, signalsData] = await Promise.all([
          fetcher<Product[]>('/api/products'),
          fetcher<MarketSignal[]>('/api/signals'),
        ]);
        setProducts(productsData);
        setSignals(signalsData.slice(0, 4));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: 'Total Produk', value: products.length, icon: Package, color: 'text-primary' },
    { label: 'Target Pasar', value: products.reduce((acc, p) => acc + p.targetMarkets.length, 0), icon: Globe, color: 'text-accent' },
    { label: 'Gap Teridentifikasi', value: products.reduce((acc, p) => acc + p._count.gaps, 0), icon: AlertTriangle, color: 'text-warning' },
    { label: 'Checklist Items', value: products.reduce((acc, p) => acc + p._count.checklistItems, 0), icon: FileCheck, color: 'text-success' },
  ];

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Ringkasan kesiapan ekspor produk Anda</p>
        </div>
        <Link href="/products/new" className="w-full sm:w-auto">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Products List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Produk Anda</CardTitle>
              <CardDescription>Daftar produk yang terdaftar</CardDescription>
            </div>
            <Link href="/products">
              <Button variant="ghost" size="sm" className="gap-1">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Memuat...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Belum ada produk terdaftar</p>
                <Link href="/products/new">
                  <Button>Tambah Produk Pertama</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
                          {product.targetMarkets.slice(0, 2).map((m) => (
                            <span key={m.countryCode} className="text-sm">
                              {getCountryFlag(m.countryCode)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{product._count.gaps} gap</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Market Signals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Market Signals</CardTitle>
              <CardDescription>Insight pasar terbaru</CardDescription>
            </div>
            <Link href="/signals">
              <Button variant="ghost" size="sm" className="gap-1">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Memuat...</div>
            ) : signals.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Belum ada market signals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {signals.map((signal) => (
                  <div key={signal.id} className="p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getCountryFlag(signal.countryCode)}</span>
                      <span className="font-medium">{signal.countryName}</span>
                      <Badge variant="outline">{getCategoryLabel(signal.category)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {signal.demandOverview}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="mt-8 border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning">Disclaimer</p>
              <p className="text-sm text-muted-foreground mt-1">
                Demo hackathon. Dataset contoh. Bukan nasihat hukum. Selalu konsultasikan dengan ahli ekspor dan otoritas terkait sebelum memulai ekspor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
