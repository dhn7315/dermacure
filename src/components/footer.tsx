'use client';

import * as React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export function Footer() {
  const [year, setYear] = React.useState<number | null>(null);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <h3 className="font-headline text-2xl font-bold text-primary mb-4">DERMA CARE</h3>
            <p className="text-muted-foreground text-sm">AI-powered skin analysis and personalized care routines.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg text-primary/90 mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg text-primary/90 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><a href="mailto:support@dermacare.com" className="text-muted-foreground hover:text-primary transition-colors">support@dermacare.com</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg text-primary/90 mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-white/10 text-muted-foreground">
          <p className="text-primary [text-shadow:0_0_0.5em_hsl(var(--primary))] transition-all hover:tracking-wider">
            &copy; {year} DERMA CARE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
