"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/teachers", label: "Teachers" },
  { href: "/teachers/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Crown className="h-6 w-6 text-accent transition-transform group-hover:rotate-12" />
          <span className="text-lg font-bold tracking-tight">
            Chess<span className="text-accent">Lens</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-muted rounded-lg transition-colors hover:text-foreground hover:bg-card"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="secondary" size="sm">
            Log In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>

        <button
          className="md:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-muted rounded-lg hover:text-foreground hover:bg-card"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button variant="secondary" size="sm" className="w-full">
              Log In
            </Button>
            <Button size="sm" className="w-full">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
