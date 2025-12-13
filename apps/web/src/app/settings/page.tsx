'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, User, Bell, Globe, Shield, Save, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    companyName: '',
    email: '',
    language: 'id',
    notifications: 'all',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">Kelola preferensi akun dan aplikasi</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
            <CardDescription>Informasi dasar perusahaan Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nama Perusahaan</Label>
              <Input id="companyName" placeholder="PT Contoh Indonesia" value={settings.companyName} onChange={(e) => setSettings({ ...settings, companyName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@perusahaan.com" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferensi
            </CardTitle>
            <CardDescription>Sesuaikan pengalaman aplikasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Bahasa</Label>
              <Select value={settings.language} onValueChange={(value: string) => setSettings({ ...settings, language: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifikasi
            </CardTitle>
            <CardDescription>Atur preferensi notifikasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Frekuensi Notifikasi</Label>
              <Select value={settings.notifications} onValueChange={(value: string) => setSettings({ ...settings, notifications: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua notifikasi</SelectItem>
                  <SelectItem value="important">Hanya yang penting</SelectItem>
                  <SelectItem value="none">Nonaktifkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data & Privasi
            </CardTitle>
            <CardDescription>Kelola data dan privasi Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Data Anda disimpan dengan aman dan tidak dibagikan ke pihak ketiga tanpa persetujuan.</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export Data</Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Hapus Semua Data</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-4">
          {saved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="h-4 w-4" />Tersimpan</span>}
          <Button onClick={handleSave} className="gap-2"><Save className="h-4 w-4" />Simpan Pengaturan</Button>
        </div>
      </div>
    </div>
  );
}
