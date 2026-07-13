"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Sun, Battery, LayoutDashboard, LogOut, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar({ dbOffline = false }: { dbOffline?: boolean }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-primary tracking-tight">
          <div className="bg-primary/10 p-1.5 rounded-lg text-primary flex items-center justify-center">
            <Sun className="h-5 w-5 animate-pulse text-accent" />
            <Battery className="h-4 w-4 -ml-1 text-primary" />
          </div>
          <span className="bg-gradient-to-r from-emerald-600 to-teal-800 dark:from-emerald-400 dark:to-teal-500 bg-clip-text text-transparent">
            Store & Share
          </span>
        </Link>

        {/* Global Links */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors mr-2">
            ROI Calculator
          </Link>
        </nav>

        {/* Auth / Controls */}
        <div className="flex items-center space-x-4">
          {dbOffline && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/30">
              Demo Mode (DB Offline)
            </span>
          )}

          {!loading && (
            <>
              {session ? (
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-muted-foreground hidden lg:inline-block">
                    {session.user.name || session.user.email}
                  </span>
                  
                  {session.user.role === "ADMIN" ? (
                    <Link href="/admin">
                      <Button size="sm" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Panel
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/dashboard">
                      <Button size="sm" variant="default" className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-muted-foreground hover:text-destructive flex items-center gap-1.5"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 flex items-center gap-1.5 font-semibold">
                    <Key className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
