"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  List,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

const LINKS = [
  { href: "", label: "Dashboard", icon: LayoutDashboard },
  { href: "/ratings", label: "Ratings", icon: TrendingUp },
  { href: "/openings", label: "Openings", icon: BookOpen },
  { href: "/games", label: "Games", icon: List },
  { href: "/activity", label: "Activity", icon: CalendarClock },
  { href: "/weaknesses", label: "Weaknesses", icon: AlertTriangle },
];

export function AnalyzeSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const base = `/analyze/${username}`;

  return (
    <aside className="w-full shrink-0 md:w-56 lg:w-64">
      <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {LINKS.map((link) => {
          const href = `${base}${link.href}`;
          const active = pathname === href;
          return (
            <Link
              key={link.href}
              href={href}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-accent-muted text-accent"
                  : "text-muted hover:bg-card hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
