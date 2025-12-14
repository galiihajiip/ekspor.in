'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Package,
  Globe,
  FileCheck,
  TrendingUp,
  LayoutDashboard,
  Settings,
  LogIn,
  LogOut,
  Menu,
  X,
  Search,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Produk', icon: Package },
  { href: '/markets', label: 'Pasar', icon: Globe },
  { href: '/compliance', label: 'Compliance', icon: FileCheck },
  { href: '/signals', label: 'Signals', icon: TrendingUp },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Ekspor.in" className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="font-bold text-lg sm:text-xl">Ekspor.in</span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden sm:flex items-center gap-2">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                type="search"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px]"
                autoFocus
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => setShowSearch(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden md:inline">{user.name}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline">Keluar</span>
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button variant="default" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Masuk
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {showSearch && (
        <div className="sm:hidden border-t bg-background p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="search"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container py-4 space-y-2 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t pt-4 mt-4 space-y-2">
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
                Pengaturan
              </Link>
              {user ? (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted w-full"
                >
                  <LogOut className="h-5 w-5" />
                  Keluar ({user.name})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground"
                >
                  <LogIn className="h-5 w-5" />
                  Masuk
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
