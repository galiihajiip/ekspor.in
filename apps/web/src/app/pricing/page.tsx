'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Zap, Rocket, Building2, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Explore',
    subtitle: 'Gratis',
    price: { monthly: 0, yearly: 0 },
    description: 'Untuk UMKM tahap eksplorasi',
    icon: Zap,
    features: [
      { text: '1 produk', included: true },
      { text: '1 negara tujuan', included: true },
      { text: 'Skor kesiapan ekspor dasar', included: true },
      { text: 'Preview 3 gap teratas', included: true },
      { text: 'Analisis gap lengkap', included: false },
      { text: 'Checklist aksi', included: false },
      { text: 'Market signals', included: false },
      { text: 'Compliance checker', included: false },
    ],
    cta: 'Mulai Gratis',
    ctaVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Ready',
    subtitle: 'Starter',
    price: { monthly: 99000, yearly: 950000 },
    description: 'Untuk UMKM ekspor pertama',
    icon: Rocket,
    features: [
      { text: 'Hingga 5 produk', included: true },
      { text: 'Hingga 3 negara tujuan', included: true },
      { text: 'Skor kesiapan ekspor lengkap', included: true },
      { text: 'Analisis gap lengkap', included: true },
      { text: 'Checklist aksi terperinci', included: true },
      { text: 'Ringkasan market signals', included: true },
      { text: 'Compliance checker', included: false },
      { text: 'Export report (PDF)', included: false },
    ],
    cta: 'Mulai Sekarang',
    ctaVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Scale',
    subtitle: 'Growth',
    price: { monthly: 299000, yearly: 2870000 },
    description: 'Untuk UMKM ekspor aktif',
    icon: Crown,
    features: [
      { text: 'Produk unlimited', included: true },
      { text: 'Negara tujuan unlimited', included: true },
      { text: 'Skor kesiapan ekspor lengkap', included: true },
      { text: 'Analisis gap lengkap', included: true },
      { text: 'Checklist aksi terperinci', included: true },
      { text: 'Market signals prioritas', included: true },
      { text: 'Compliance checker', included: true },
      { text: 'Export report (PDF)', included: true },
    ],
    cta: 'Upgrade Sekarang',
    ctaVariant: 'default' as const,
    popular: false,
  },
  {
    name: 'Partner',
    subtitle: 'Institution',
    price: { monthly: -1, yearly: -1 },
    description: 'Untuk institusi & fasilitator',
    icon: Building2,
    features: [
      { text: 'Multi-UMKM dashboard', included: true },
      { text: 'Analitik agregat kesiapan', included: true },
      { text: 'Semua fitur Growth', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'Custom onboarding', included: true },
      { text: 'API access (roadmap)', included: true },
      { text: 'White-label (roadmap)', included: true },
      { text: 'SLA & kontrak khusus', included: true },
    ],
    cta: 'Hubungi Kami',
    ctaVariant: 'outline' as const,
    popular: false,
  },
];

function formatPrice(price: number): string {
  if (price === 0) return 'Rp0';
  if (price === -1) return 'Custom';
  return `Rp${price.toLocaleString('id-ID')}`;
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <Badge variant="secondary" className="mb-4">Harga Demo Hackathon</Badge>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Pilih Paket yang Tepat untuk Bisnis Anda</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Satu keputusan ekspor yang salah bisa menghabiskan jutaan rupiah. 
          Investasi kecil untuk kepastian besar dalam perjalanan ekspor Anda.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm ${!isYearly ? 'font-medium' : 'text-muted-foreground'}`}>Bulanan</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${isYearly ? 'bg-primary' : 'bg-muted'}`}
          >
            <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isYearly ? 'translate-x-8' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm ${isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
            Tahunan <Badge variant="secondary" className="ml-1">Hemat 20%</Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = isYearly ? plan.price.yearly : plan.price.monthly;
          return (
            <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Paling Populer</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold">{formatPrice(price)}</span>
                  {price > 0 && <span className="text-muted-foreground">/{isYearly ? 'tahun' : 'bulan'}</span>}
                </div>
                <Button variant={plan.ctaVariant} className="w-full mb-6">{plan.cta}</Button>
                <ul className="space-y-2 text-left text-sm">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {f.included ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-muted-foreground" />}
                      <span className={f.included ? '' : 'text-muted-foreground'}>{f.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Value Proposition */}
      <div className="bg-muted/50 rounded-xl p-6 sm:p-8 mb-12">
        <h2 className="text-xl font-bold mb-4 text-center">Mengapa Investasi di Ekspor.in?</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">Rp50jt+</div>
            <p className="text-sm text-muted-foreground">Potensi kerugian dari satu pengiriman ekspor yang gagal karena ketidakpatuhan</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">3-6 bulan</div>
            <p className="text-sm text-muted-foreground">Waktu yang terbuang jika produk ditolak di negara tujuan</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">Rp99rb/bln</div>
            <p className="text-sm text-muted-foreground">Investasi kecil untuk kepastian dan kepercayaan diri ekspor</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6 text-center">Pertanyaan Umum</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Apakah paket Gratis benar-benar gratis?</h3>
            <p className="text-sm text-muted-foreground">Ya, paket Explore sepenuhnya gratis tanpa batas waktu. Anda bisa menggunakannya untuk memahami platform dan mengevaluasi 1 produk ke 1 negara tujuan.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Bagaimana cara upgrade paket?</h3>
            <p className="text-sm text-muted-foreground">Anda bisa upgrade kapan saja dari halaman Settings. Pembayaran mendukung transfer bank dan e-wallet populer di Indonesia.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Apakah ada kontrak jangka panjang?</h3>
            <p className="text-sm text-muted-foreground">Tidak ada kontrak mengikat untuk paket Starter dan Growth. Anda bisa berhenti berlangganan kapan saja. Paket Partner memiliki kontrak khusus sesuai kebutuhan institusi.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Siapa yang cocok dengan paket Partner?</h3>
            <p className="text-sm text-muted-foreground">Paket Partner dirancang untuk Kementerian, BUMN, Bank, Dinas Perdagangan, dan fasilitator ekspor yang membina banyak UMKM sekaligus.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 p-8 bg-primary text-primary-foreground rounded-xl">
        <h2 className="text-2xl font-bold mb-2">Siap Memulai Perjalanan Ekspor?</h2>
        <p className="mb-6 text-primary-foreground/80">Mulai gratis, upgrade ketika bisnis Anda siap berkembang.</p>
        <Link href="/login"><Button variant="secondary" size="lg">Mulai Gratis Sekarang</Button></Link>
      </div>
    </div>
  );
}
