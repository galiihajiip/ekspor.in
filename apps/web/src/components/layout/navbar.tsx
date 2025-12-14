'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Package, Globe, FileCheck, TrendingUp, LayoutDashboard, Settings, Search, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Produk', icon: Package },
  { href: '/markets', label: 'Target Pasar', icon: Globe },
  { href: '/compliance', label: 'Compliance', icon: FileCheck },
  { href: '/signals', label: 'Market Signals', icon: TrendingUp },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-8">
          <img src="/logo.svg" alt="Ekspor.in" className="w-8 h-8" />
          <span className="font-bold text-xl">Ekspor.in</span>
        </Link>

        <nav className="flex items-center space-x-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari..."
              className="pl-8 w-[200px] lg:w-[280px]"
            />
          </div>

          <ThemeToggle />

          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="default" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Masuk</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
