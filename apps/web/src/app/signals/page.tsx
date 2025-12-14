'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Globe, Filter, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { fetcher, getCategoryLabel, getCountryFlag } from '@/lib/utils';

interface MarketSignal {
  id: string;
  countryCode: string;
  countryName: string;
  category: string;
  demandOverview: string;
  competitorLandscape: string;
  entryBarriers: string;
  opportunities: string;
  pricingInsights: string;
  generatedAt: string;
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [selectedCategory, setSelectedCategory] = useState<string>('FOOD');

  useEffect(() => {
    loadSignals();
  }, []);

  async function loadSignals() {
    try {
      const data = await fetcher<MarketSignal[]>('/api/signals');
      setSignals(data);
    } catch (error) {
      console.error('Failed to load signals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function generateSignal() {
    setGenerating(true);
    try {
      const newSignal = await fetcher<MarketSignal>('/api/signals/generate', {
        method: 'POST',
        body: JSON.stringify({ category: selectedCategory, countryCode: selectedCountry }),
      });
      // Add new signal to the beginning of the list
      setSignals(prev => [newSignal, ...prev.filter(s => !(s.countryCode === newSignal.countryCode && s.category === newSignal.category))]);
    } catch (error) {
      console.error('Failed to generate signal:', error);
    } finally {
      setGenerating(false);
    }
  }

  const filteredSignals = signals.filter((signal) => {
    const matchesCountry = countryFilter === 'all' || signal.countryCode === countryFilter;
    const matchesCategory = categoryFilter === 'all' || signal.category === categoryFilter;
    return matchesCountry && matchesCategory;
  });

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Market Signals</h1>
          <p className="text-muted-foreground mt-1">Insight pasar dan peluang ekspor berdasarkan AI</p>
        </div>
        <Button onClick={loadSignals} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Market Signal Baru
          </CardTitle>
          <CardDescription>Gunakan AI untuk menghasilkan insight pasar terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Negara" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">🇺🇸 Amerika Serikat</SelectItem>
                <SelectItem value="JP">🇯🇵 Jepang</SelectItem>
                <SelectItem value="SG">🇸🇬 Singapura</SelectItem>
                <SelectItem value="CN">🇨🇳 Tiongkok</SelectItem>
                <SelectItem value="KR">🇰🇷 Korea Selatan</SelectItem>
                <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                <SelectItem value="DE">🇩🇪 Jerman</SelectItem>
                <SelectItem value="GB">🇬🇧 Inggris</SelectItem>
                <SelectItem value="AE">🇦🇪 Uni Emirat Arab</SelectItem>
                <SelectItem value="SA">🇸🇦 Arab Saudi</SelectItem>
                <SelectItem value="MY">🇲🇾 Malaysia</SelectItem>
                <SelectItem value="TH">🇹🇭 Thailand</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOOD">Makanan</SelectItem>
                <SelectItem value="COSMETICS">Kosmetik</SelectItem>
                <SelectItem value="APPAREL">Pakaian</SelectItem>
                <SelectItem value="HANDICRAFT">Kerajinan</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generateSignal} disabled={generating} className="gap-2">
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" />Generating...</> : <><Sparkles className="h-4 w-4" />Generate Signal</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Globe className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Semua Negara" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Negara</SelectItem>
            <SelectItem value="US">🇺🇸 Amerika Serikat</SelectItem>
            <SelectItem value="JP">🇯🇵 Jepang</SelectItem>
            <SelectItem value="SG">🇸🇬 Singapura</SelectItem>
            <SelectItem value="CN">🇨🇳 Tiongkok</SelectItem>
            <SelectItem value="KR">🇰🇷 Korea Selatan</SelectItem>
            <SelectItem value="AU">🇦🇺 Australia</SelectItem>
            <SelectItem value="DE">🇩🇪 Jerman</SelectItem>
            <SelectItem value="GB">🇬🇧 Inggris</SelectItem>
            <SelectItem value="AE">🇦🇪 Uni Emirat Arab</SelectItem>
            <SelectItem value="SA">🇸🇦 Arab Saudi</SelectItem>
            <SelectItem value="MY">🇲🇾 Malaysia</SelectItem>
            <SelectItem value="TH">🇹🇭 Thailand</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="FOOD">Makanan</SelectItem>
            <SelectItem value="COSMETICS">Kosmetik</SelectItem>
            <SelectItem value="APPAREL">Pakaian</SelectItem>
            <SelectItem value="HANDICRAFT">Kerajinan</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground self-center">{filteredSignals.length} signal ditemukan</div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Memuat signals...</div>
      ) : filteredSignals.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Belum ada market signals</h3>
            <p className="text-muted-foreground mb-6">Generate signal baru untuk mendapatkan insight pasar.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredSignals.map((signal) => (
            <Card key={signal.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCountryFlag(signal.countryCode)}</span>
                    <div>
                      <CardTitle className="text-lg">{signal.countryName}</CardTitle>
                      <Badge variant="secondary">{getCategoryLabel(signal.category)}</Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(signal.generatedAt).toLocaleDateString('id-ID')}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {signal.demandOverview && <div><h4 className="text-sm font-medium mb-1">📊 Demand Overview</h4><p className="text-sm text-muted-foreground">{signal.demandOverview}</p></div>}
                {signal.competitorLandscape && <div><h4 className="text-sm font-medium mb-1">🏢 Competitor Landscape</h4><p className="text-sm text-muted-foreground">{signal.competitorLandscape}</p></div>}
                {signal.entryBarriers && <div><h4 className="text-sm font-medium mb-1">🚧 Entry Barriers</h4><p className="text-sm text-muted-foreground">{signal.entryBarriers}</p></div>}
                {signal.opportunities && <div><h4 className="text-sm font-medium mb-1">💡 Opportunities</h4><p className="text-sm text-muted-foreground">{signal.opportunities}</p></div>}
                {signal.pricingInsights && <div><h4 className="text-sm font-medium mb-1">💰 Pricing Insights</h4><p className="text-sm text-muted-foreground">{signal.pricingInsights}</p></div>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
