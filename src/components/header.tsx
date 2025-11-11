'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import React from 'react';


function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode, onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="animated-button relative inline-block rounded-full px-4 py-2 text-sm font-medium text-foreground/60 shadow-[0_0_0_2px_hsl(var(--border))] transition-all duration-500 ease-in-out hover:text-primary-foreground hover:shadow-[0_0_0_5px_hsla(var(--primary)/0.4)] active:scale-95"
    >
      <span className="relative z-10">{children}</span>
      <span className="animated-button-bg absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-all duration-700 ease-in-out"></span>
    </Link>
  );
}

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  return (
    <header className="py-6 px-4 md:px-8 bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-40 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold transition-opacity hover:opacity-80">
          <Image src="/iimg.svg" alt="DERMA CARE Logo" width={36} height={36} />
          <span className="font-headline uppercase tracking-wider text-primary">DERMA CARE</span>
        </Link>
        <style jsx>{`
          .animated-button:hover .animated-button-bg {
            width: 150px;
            height: 150px;
            opacity: 1;
          }
        `}</style>
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/#analysis">Analyze</NavLink>
          <NavLink href="/#routines">Routines</NavLink>
          <NavLink href="/#guide">Guide</NavLink>
        </nav>
        <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <nav className="flex flex-col gap-4 mt-8">
                        <NavLink href="/" onClick={() => setIsSheetOpen(false)}>Home</NavLink>
                        <NavLink href="/#analysis" onClick={() => setIsSheetOpen(false)}>Analyze</NavLink>
                        <NavLink href="/#routines" onClick={() => setIsSheetOpen(false)}>Routines</NavLink>
                        <NavLink href="/#guide" onClick={() => setIsSheetOpen(false)}>Guide</NavLink>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
