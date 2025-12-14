'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, FileCheck, Filter } from 'lucide-react';
import { fetcher, getCategoryLabel, getCountryFlag, getSeverityColor } from '@/lib/utils';

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface Requirement {
  id: string;
  countryCode: string;
  category: string;
  requirementType: string;
  title: string;
  description: string;
  severity: string;
  source: string;
}

interface RequirementStats {
  countryCode: string;
  category: string;
  _count: { _all: number };
}

export default function MarketsPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [stats, setStats] = useState<RequirementStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [countriesData, requirementsData, statsData] = await Promise.all([
          fetcher<Country[]>('/api/markets/countries'),
          fetcher<Requirement[]>('/api/markets/requirements'),
          fetcher<RequirementStats[]>('/api/markets/requirements/stats'),
        ]);
        setCountries(countriesData);
        setRequirements(requirementsData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load markets data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredRequirements = requirements.filter((req) => {
    const matchesCountry = selectedCountry === 'all' || req.countryCode === selectedCountry;
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
    return matchesCountry && matchesCategory;
  });

  const getRequirementCount = (countryCode: string) => {
    return stats
      .filter((s) => s.countryCode === countryCode)
      .reduce((acc, s) => acc + s._count._all, 0);
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Target Pasar</h1>
        <p className="text-muted-foreground mt-1">
          Jelajahi persyaratan ekspor untuk berbagai negara tujuan
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-muted-foreground">Memuat...</div>
        ) : (
          countries.map((country) => (
            <Card
              key={country.code}
              className={`cursor-pointer transition-colors ${
                selectedCountry === country.code ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedCountry(selectedCountry === country.code ? 'all' : country.code)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <h3 className="font-semibold">{country.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getRequirementCount(country.code)} persyaratan
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            <SelectItem value="FOOD">Makanan</SelectItem>
            <SelectItem value="COSMETICS">Kosmetik</SelectItem>
            <SelectItem value="APPAREL">Pakaian</SelectItem>
            <SelectItem value="HANDICRAFT">Kerajinan</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {filteredRequirements.length} persyaratan ditemukan
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all" className="flex-1 min-w-[80px]">Semua</TabsTrigger>
          <TabsTrigger value="CERTIFICATION" className="flex-1 min-w-[80px]">Sertifikasi</TabsTrigger>
          <TabsTrigger value="LABELING" className="flex-1 min-w-[80px]">Pelabelan</TabsTrigger>
          <TabsTrigger value="DOCUMENTATION" className="flex-1 min-w-[80px]">Dokumentasi</TabsTrigger>
          <TabsTrigger value="TESTING" className="flex-1 min-w-[80px]">Pengujian</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRequirements.length === 0 ? (
            <Card className="py-8">
              <CardContent className="text-center">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Tidak ada persyaratan ditemukan</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequirements.map((req) => (
              <RequirementCard key={req.id} requirement={req} />
            ))
          )}
        </TabsContent>

        {['CERTIFICATION', 'LABELING', 'DOCUMENTATION', 'TESTING'].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            {filteredRequirements.filter((r) => r.requirementType === type).length === 0 ? (
              <Card className="py-8">
                <CardContent className="text-center">
                  <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Tidak ada persyaratan {type.toLowerCase()}</p>
                </CardContent>
              </Card>
            ) : (
              filteredRequirements
                .filter((r) => r.requirementType === type)
                .map((req) => <RequirementCard key={req.id} requirement={req} />)
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function RequirementCard({ requirement }: { requirement: Requirement }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span>{getCountryFlag(requirement.countryCode)}</span>
            <Badge variant="secondary">{getCategoryLabel(requirement.category)}</Badge>
            <Badge variant="outline">{requirement.requirementType}</Badge>
          </div>
          <Badge className={getSeverityColor(requirement.severity)}>
            {requirement.severity}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{requirement.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{requirement.description}</p>
        {requirement.source && (
          <p className="text-xs text-muted-foreground mt-2">Sumber: {requirement.source}</p>
        )}
      </CardContent>
    </Card>
  );
}
