import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Globe, FileCheck, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: 'Evaluasi Kesiapan Produk',
    description: 'Analisis gap antara produk Anda dengan persyaratan ekspor negara tujuan.',
  },
  {
    icon: Globe,
    title: 'Multi-Pasar',
    description: 'Dukungan untuk berbagai negara tujuan: Amerika Serikat, Jepang, Singapura.',
  },
  {
    icon: FileCheck,
    title: 'Compliance Checker',
    description: 'Verifikasi dokumen dan sertifikasi terhadap standar ekspor internasional.',
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    description: 'Insight pasar dan rekomendasi positioning untuk produk UMKM Indonesia.',
  },
];

const stats = [
  { value: '3', label: 'Negara Tujuan' },
  { value: '4', label: 'Kategori Produk' },
  { value: '35+', label: 'Persyaratan Ekspor' },
  { value: '100%', label: 'Gratis' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Platform Evaluasi Kesiapan Ekspor
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Know your export readiness,{' '}
              <span className="text-primary">before you enter.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ekspor.in membantu UMKM Indonesia mengevaluasi kesiapan produk untuk pasar ekspor,
              mengidentifikasi gap kepatuhan, dan memahami sinyal pasar sebelum memulai ekspor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Mulai Evaluasi
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/disclaimer">
                <Button size="lg" variant="outline">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fitur Utama</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Platform lengkap untuk mempersiapkan produk UMKM Indonesia memasuki pasar ekspor internasional.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai Perjalanan Ekspor?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Evaluasi kesiapan produk Anda sekarang dan dapatkan insight yang diperlukan untuk memasuki pasar internasional.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="gap-2">
              Daftarkan Produk Anda
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
