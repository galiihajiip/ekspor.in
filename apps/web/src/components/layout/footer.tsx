import Link from 'next/link';
import { Github, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />
            <span>Demo Hackathon — Dataset contoh. Bukan nasihat hukum.</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/disclaimer"
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Disclaimer
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 Ekspor.in — Export Readiness Platform</p>
          <p className="mt-1">Know your export readiness, before you enter.</p>
        </div>
      </div>
    </footer>
  );
}
