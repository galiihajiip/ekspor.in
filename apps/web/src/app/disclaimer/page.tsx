import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, Shield, FileCheck } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="container py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Disclaimer & Informasi</h1>
        <p className="text-muted-foreground mt-1">Informasi penting tentang penggunaan platform Ekspor.in</p>
      </div>

      <div className="space-y-6">
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Disclaimer Penting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p><strong>Ekspor.in adalah demo hackathon</strong> yang dibuat untuk tujuan demonstrasi dan edukasi. Platform ini menggunakan dataset contoh dan tidak dimaksudkan untuk penggunaan produksi.</p>
            <p>Informasi yang disediakan di platform ini <strong>bukan merupakan nasihat hukum, bisnis, atau profesional</strong>. Selalu konsultasikan dengan ahli ekspor, konsultan hukum, dan otoritas terkait sebelum memulai kegiatan ekspor.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Tentang Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Ekspor.in adalah platform evaluasi kesiapan ekspor yang dirancang untuk membantu UMKM Indonesia memahami persyaratan ekspor ke berbagai negara tujuan.</p>
            <p>Fitur utama meliputi:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Evaluasi kesiapan produk untuk pasar ekspor</li>
              <li>Identifikasi gap kepatuhan terhadap standar internasional</li>
              <li>Market intelligence berbasis AI</li>
              <li>Compliance checker untuk dokumen ekspor</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privasi Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Untuk demo ini, data disimpan secara lokal dan tidak dikirim ke server eksternal kecuali untuk fitur AI yang menggunakan Google Gemini API.</p>
            <p>Dalam implementasi produksi, data pengguna akan dilindungi sesuai dengan standar keamanan industri dan regulasi perlindungan data yang berlaku.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Sumber Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Persyaratan ekspor yang ditampilkan di platform ini dikompilasi dari berbagai sumber publik termasuk:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>FDA (Food and Drug Administration) - Amerika Serikat</li>
              <li>MHLW (Ministry of Health, Labour and Welfare) - Jepang</li>
              <li>SFA (Singapore Food Agency) - Singapura</li>
              <li>Kementerian Perdagangan Republik Indonesia</li>
            </ul>
            <p className="mt-4"><strong>Catatan:</strong> Persyaratan ekspor dapat berubah sewaktu-waktu. Selalu verifikasi informasi terbaru dari sumber resmi.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
