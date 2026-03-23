import Link from "next/link";
import { Crown } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Compare Players", href: "/compare" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Teachers", href: "/teachers" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-accent" />
              <span className="font-bold">
                Chess<span className="text-accent">Lens</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Analyze your Lichess games and unlock your chess potential with
              data-driven insights.
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} ChessLens. Not affiliated with
          Lichess. Powered by the Lichess API.
        </div>
      </div>
    </footer>
  );
}
