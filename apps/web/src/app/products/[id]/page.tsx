'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, Package, Globe, AlertTriangle, CheckCircle, Plus,
  FileText, Download, Loader2, BarChart3, X
} from 'lucide-react';
import { getCategoryLabel, getCountryFlag, getScoreColor } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  targetMarkets: { countryCode: string; countryName: string }[];
  _count: { gaps: number; checklistItems: number };
}

interface Analysis {
  readinessScore: number;
  categories: { name: string; score: number; status: string; items: string[] }[];
  recommendations: string[];
  gaps: { title: string; severity: string; description: string }[];
}

const productsData: Product[] = [
  { id: '1', name: 'Kopi Arabika Gayo', description: 'Kopi premium dari dataran tinggi Gayo, Aceh.', category: 'FOOD', targetMarkets: [{ countryCode: 'US', countryName: 'Amerika Serikat' }, { countryCode: 'JP', countryName: 'Jepang' }], _count: { gaps: 2, checklistItems: 5 } },
  { id: '2', name: 'Batik Tulis Solo', description: 'Batik tulis tradisional dengan motif klasik.', category: 'APPAREL', targetMarkets: [{ countryCode: 'SG', countryName: 'Singapura' }, { countryCode: 'JP', countryName: 'Jepang' }], _count: { gaps: 1, checklistItems: 3 } },
  { id: '3', name: 'Minyak Kelapa VCO', description: 'Virgin Coconut Oil organik dari Sulawesi.', category: 'FOOD', targetMarkets: [{ countryCode: 'AU', countryName: 'Australia' }, { countryCode: 'DE', countryName: 'Jerman' }], _count: { gaps: 3, checklistItems: 6 } },
  { id: '4', name: 'Skincare Bali Alus', description: 'Rangkaian skincare dengan bahan alami Bali.', category: 'COSMETICS', targetMarkets: [{ countryCode: 'KR', countryName: 'Korea Selatan' }, { countryCode: 'CN', countryName: 'Tiongkok' }], _count: { gaps: 4, checklistItems: 8 } },
];

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          setProduct(await res.json());
        } else {
          setProduct(productsData.find((p) => p.id === params.id) || null);
        }
      } catch {
        setProduct(productsData.find((p) => p.id === params.id) || null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  const handleAnalyze = async () => {
    if (!product) return;
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/products/${params.id}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: product.category }),
      });
      if (res.ok) {
        setAnalysis(await res.json());
        setShowAnalysis(true);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleExportReport = async () => {
    if (!product) return;
    setExporting(true);
    try {
      const res = await fetch(`/api/products/${params.id}/report`);
      if (res.ok) {
        const report = await res.json();
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `export-report-${product.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <div className="container py-8 text-center text-muted-foreground">Memuat...</div>;

  if (!product) {
    return (
      <div className="container px-4 py-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />Kembali
        </Link>
        <Card className="py-12">
          <CardContent className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Produk tidak ditemukan</h3>
            <Link href="/products"><Button>Lihat Semua Produk</Button></Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-6 sm:py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />Kembali ke Produk
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Badge variant="secondary" className="w-fit">{getCategoryLabel(product.category)}</Badge>
              <CardTitle className="text-xl sm:text-2xl mt-2">{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Globe className="h-5 w-5" />Target Pasar</CardTitle>
            </CardHeader>
            <CardContent>
              {product.targetMarkets.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.targetMarkets.map((m) => (
                    <div key={m.countryCode} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="text-2xl">{getCountryFlag(m.countryCode)}</span>
                      <div>
                        <p className="font-medium">{m.countryName}</p>
                        <Link href="/markets" className="text-sm text-primary hover:underline">Lihat persyaratan →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Belum ada target pasar</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-orange-500" />Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <p className="font-medium text-orange-800 dark:text-orange-400">FDA Registration Required</p>
                  <p className="text-sm text-orange-600 dark:text-orange-500">Fasilitas produksi perlu terdaftar di FDA</p>
                </div>
                <div className="p-3 border rounded-lg border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                  <p className="font-medium text-yellow-800 dark:text-yellow-400">Nutrition Label Format</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-500">Label nutrisi perlu disesuaikan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Ringkasan</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Target Pasar</span><span className="font-medium">{product.targetMarkets.length} negara</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gap</span><span className="font-medium text-orange-500">{product._count.gaps}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Checklist</span><span className="font-medium">{product._count.checklistItems}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Aksi</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2" onClick={handleAnalyze} disabled={analyzing}>
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                {analyzing ? 'Menganalisis...' : 'Analisis Kesiapan'}
              </Button>
              <Button variant="outline" className="w-full gap-2" onClick={handleExportReport} disabled={exporting}>
                {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {exporting ? 'Mengekspor...' : 'Export Report'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showAnalysis && analysis && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hasil Analisis Kesiapan</CardTitle>
                <CardDescription>{product.name}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAnalysis(false)}><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Skor Kesiapan Ekspor</p>
                <p className={`text-4xl font-bold ${getScoreColor(analysis.readinessScore)}`}>{analysis.readinessScore}%</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Kategori Penilaian</h4>
                {analysis.categories.map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-sm"><span>{cat.name}</span><span className={getScoreColor(cat.score)}>{cat.score}%</span></div>
                    <Progress value={cat.score} className="h-2" />
                  </div>
                ))}
              </div>

              {analysis.gaps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Gap Teridentifikasi</h4>
                  {analysis.gaps.map((gap, i) => (
                    <div key={i} className="p-3 border rounded-lg bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                      <div className="flex items-center gap-2"><Badge variant="outline" className="text-orange-600">{gap.severity}</Badge><span className="font-medium">{gap.title}</span></div>
                      <p className="text-sm text-muted-foreground mt-1">{gap.description}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-medium">Rekomendasi</h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />{rec}</li>
                  ))}
                </ul>
              </div>

              <Button className="w-full" onClick={() => setShowAnalysis(false)}>Tutup</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
