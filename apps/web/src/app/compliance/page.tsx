'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileCheck, Upload, FileText, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { fetcher, getSeverityColor } from '@/lib/utils';

interface ComplianceResult {
  id: string;
  overallScore: number;
  summary: string;
  issues: {
    type: string;
    severity: string;
    description: string;
    recommendation: string;
  }[];
  checkedAt: string;
}

export default function CompliancePage() {
  const [documentText, setDocumentText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTextCheck = async () => {
    if (!documentText.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher<ComplianceResult>('/api/compliance/check', {
        method: 'POST',
        body: JSON.stringify({ userId: 'demo-user', documentText }),
      });
      setResult(data);
    } catch (err) {
      setError('Gagal memeriksa dokumen. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      // Read file content and use text check API
      const text = await file.text();
      const data = await fetcher<ComplianceResult>('/api/compliance/check', {
        method: 'POST',
        body: JSON.stringify({ userId: 'demo-user', documentText: text }),
      });
      setResult(data);
    } catch (err) {
      setError('Gagal mengupload dokumen. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Baik';
    if (score >= 60) return 'Cukup';
    if (score >= 40) return 'Perlu Perbaikan';
    return 'Kritis';
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Compliance Checker</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Verifikasi dokumen ekspor Anda terhadap standar internasional</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Tabs defaultValue="text">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Input Teks</TabsTrigger>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Teks Dokumen
                  </CardTitle>
                  <CardDescription>Paste konten dokumen ekspor untuk diperiksa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    className="w-full h-64 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Paste konten dokumen di sini..."
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                  />
                  <Button onClick={handleTextCheck} disabled={loading || !documentText.trim()} className="w-full">
                    {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Memeriksa...</> : <><FileCheck className="h-4 w-4 mr-2" />Periksa Kepatuhan</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Dokumen
                  </CardTitle>
                  <CardDescription>Upload file PDF atau TXT untuk diperiksa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Input type="file" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
                    <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <span className="text-sm font-medium">{file ? file.name : 'Klik untuk memilih file'}</span>
                      <span className="text-xs text-muted-foreground mt-1">PDF atau TXT (max 5MB)</span>
                    </Label>
                  </div>
                  <Button onClick={handleFileUpload} disabled={loading || !file} className="w-full">
                    {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Mengupload...</> : <><FileCheck className="h-4 w-4 mr-2" />Upload & Periksa</>}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {result ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Hasil Pemeriksaan</span>
                  <span className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}%</span>
                </CardTitle>
                <CardDescription>{getScoreLabel(result.overallScore)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Skor Kepatuhan</span>
                    <span>{result.overallScore}%</span>
                  </div>
                  <Progress value={result.overallScore} />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Ringkasan</h4>
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                </div>
                {result.issues && result.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Temuan ({result.issues.length})</h4>
                    <div className="space-y-3">
                      {result.issues.map((issue, idx) => (
                        <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                          <div className="flex items-center gap-2 mb-1">
                            {issue.severity === 'CRITICAL' || issue.severity === 'HIGH' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            <Badge variant="outline">{issue.type}</Badge>
                          </div>
                          <p className="text-sm font-medium">{issue.description}</p>
                          {issue.recommendation && <p className="text-xs mt-1 opacity-80">💡 {issue.recommendation}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <CardContent className="text-center">
                <FileCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Belum Ada Hasil</h3>
                <p className="text-sm text-muted-foreground">Masukkan teks dokumen atau upload file untuk memulai pemeriksaan kepatuhan.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card className="mt-8 border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-warning">Disclaimer</p>
              <p className="text-sm text-muted-foreground mt-1">Hasil pemeriksaan ini bersifat indikatif dan tidak menggantikan verifikasi resmi dari otoritas terkait.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
