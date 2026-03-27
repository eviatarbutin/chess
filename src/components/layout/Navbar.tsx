"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Crown, LogOut, User, ChevronDown, BarChart3, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/teachers", label: "Teachers" },
  { href: "/teachers/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [lichessUsername, setLichessUsername] = useState<string | null>(null);
  const [chessComUsername, setChessComUsername] = useState<string | null>(null);
  const [profileDisplayName, setProfileDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, lichess_username, chess_com_username")
          .eq("id", data.user.id)
          .single();
        if (profile) {
          if (profile.display_name) setProfileDisplayName(profile.display_name);
          if (profile.lichess_username) setLichessUsername(profile.lichess_username);
          if (profile.chess_com_username) setChessComUsername(profile.chess_com_username);
        }
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setLichessUsername(null);
        setChessComUsername(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setLichessUsername(null);
    setChessComUsername(null);
    setProfileDisplayName(null);
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const displayName =
    profileDisplayName ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatarUrl = user?.user_metadata?.avatar_url;
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Crown className="h-6 w-6 text-accent transition-transform group-hover:rotate-12" />
          <span className="text-lg font-bold tracking-tight">
            Chess<span className="text-accent">Boost</span>
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
          {user && (
            <Link
              href="/profile"
              className="px-3 py-2 text-sm text-muted rounded-lg transition-colors hover:text-foreground hover:bg-card"
            >
              Profile
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-card" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-card cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-muted text-accent text-xs font-bold">
                    {avatarInitial}
                  </div>
                )}
                <span className="text-sm font-medium max-w-[120px] truncate">
                  {displayName}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl shadow-black/20 overflow-hidden z-50">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-medium truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                    {lichessUsername && (
                      <Link
                        href={`/analyze/${encodeURIComponent(lichessUsername)}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Lichess Analysis
                      </Link>
                    )}
                    {chessComUsername && (
                      <Link
                        href={`/analyze/${encodeURIComponent(chessComUsername)}?platform=chesscom`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                      >
                        <BarChart3 className="h-4 w-4" />
                        Chess.com Analysis
                      </Link>
                    )}
                    {lichessUsername && chessComUsername && (
                      <Link
                        href="/analyze/combined"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                      >
                        <Layers className="h-4 w-4" />
                        Combined Analysis
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-card-hover transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-muted hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
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
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-5 w-5 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4 text-accent" />
                  )}
                  <span className="text-sm font-medium">{displayName}</span>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm text-muted rounded-lg hover:text-foreground hover:bg-card"
                >
                  My Profile
                </Link>
                {lichessUsername && (
                  <Link
                    href={`/analyze/${encodeURIComponent(lichessUsername)}`}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm text-muted rounded-lg hover:text-foreground hover:bg-card"
                  >
                    Lichess Analysis
                  </Link>
                )}
                {chessComUsername && (
                  <Link
                    href={`/analyze/${encodeURIComponent(chessComUsername)}?platform=chesscom`}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm text-muted rounded-lg hover:text-foreground hover:bg-card"
                  >
                    Chess.com Analysis
                  </Link>
                )}
                {lichessUsername && chessComUsername && (
                  <Link
                    href="/analyze/combined"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm text-muted rounded-lg hover:text-foreground hover:bg-card"
                  >
                    Combined Analysis
                  </Link>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
