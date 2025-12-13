# Panduan Kontribusi - Ekspor.in

Terima kasih atas minat Anda untuk berkontribusi pada Ekspor.in!

## Cara Berkontribusi

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/ekspor-in.git
cd ekspor-in
pnpm install
```

### 2. Buat Branch Baru

```bash
git checkout -b feature/nama-fitur
# atau
git checkout -b fix/nama-bug
```

### 3. Commit Convention

Gunakan format commit message berikut:

```
type(scope): description

[optional body]
```

Types:
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi
- `style`: Formatting, missing semicolons, dll
- `refactor`: Refactoring kode
- `test`: Menambah atau memperbaiki test
- `chore`: Maintenance

Contoh:
```
feat(api): add compliance checker endpoint
fix(web): resolve product form validation
docs(readme): update installation steps
```

### 4. Pull Request

1. Pastikan kode lolos lint: `pnpm lint`
2. Pastikan test lolos: `pnpm test`
3. Push ke fork Anda
4. Buat Pull Request ke branch `main`

## Code Style

- Gunakan TypeScript strict mode
- Ikuti ESLint configuration yang ada
- Gunakan Prettier untuk formatting
- Tulis komentar dalam Bahasa Indonesia atau English

## Struktur Kode

```
/apps
  /web    → Frontend Next.js
  /api    → Backend NestJS
/packages
  /ui     → Shared components
```

## Testing

- Unit test untuk business logic
- Integration test untuk API endpoints
- E2E test untuk critical user flows

## Pertanyaan?

Buka issue dengan label `question` jika ada pertanyaan.
