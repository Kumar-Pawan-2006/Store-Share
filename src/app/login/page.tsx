"use client";

import React, { useState, useEffect, useTransition, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Lock, Mail, AlertCircle, FileKey } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const errParam = searchParams.get("error");
    if (errParam) {
      if (errParam.includes("CredentialsSignin") || errParam.includes("Invalid")) {
        setError("Invalid email or password.");
      } else {
        setError("Database is offline or credentials could not be checked.");
      }
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          email: email.toLowerCase().trim(),
          password,
          redirect: false,
        });

        if (res?.error) {
          setError(res.error);
        } else {
          // Success: wait a bit and fetch session to determine redirect
          const sessionRes = await fetch("/api/auth/session");
          const session = await sessionRes.json();
          
          if (session?.user?.role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        }
      } catch (err: any) {
        setError("An unexpected error occurred. Please try again.");
      }
    });
  };

  const copyCreds = (demoEmail: string, demoPw: string) => {
    setEmail(demoEmail);
    setPassword(demoPw);
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <Card className="border border-primary/20 bg-card-dark shadow-2xl relative">
        <CardHeader className="text-center pt-8">
          <div className="mx-auto bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mb-2">
            <Lock className="text-accent h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Sign In to Store & Share</CardTitle>
          <CardDescription>Enter credentials to access your optimization panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-emerald-700/60" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@storeandshare.in"
                  className="pl-10 bg-background/80"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">PASSWORD</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-emerald-700/60" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 bg-background/80"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-xs bg-destructive/15 text-destructive rounded-lg border border-destructive/20 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold flex items-center justify-center gap-1.5"
              disabled={isPending}
            >
              {isPending ? "Authenticating Session..." : "Secure Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Seed Credentials Helper Card */}
      <Card className="border border-slate-900 bg-slate-900/30">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-accent">
            <FileKey className="h-4 w-4" />
            <span>DEMO CREDENTIALS (FOR INVESTORS)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Click credentials below to fill form automatically:
          </p>
          
          <div className="grid grid-cols-1 gap-2 text-xs">
            
            {/* Admin */}
            <div 
              onClick={() => copyCreds("admin@storeandshare.in", "admin123")}
              className="p-2 border border-slate-900 rounded-lg hover:border-emerald-600/40 bg-zinc-950/40 cursor-pointer flex justify-between items-center transition-colors group"
            >
              <div>
                <span className="font-semibold text-emerald-400 group-hover:text-emerald-300">Admin Login</span>
                <p className="text-[10px] text-muted-foreground">admin@storeandshare.in</p>
              </div>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">admin123</span>
            </div>

            {/* Nagpur Manager */}
            <div 
              onClick={() => copyCreds("nagpur1@storeandshare.in", "manager123")}
              className="p-2 border border-slate-900 rounded-lg hover:border-emerald-600/40 bg-zinc-950/40 cursor-pointer flex justify-between items-center transition-colors group"
            >
              <div>
                <span className="font-semibold text-emerald-400 group-hover:text-emerald-300">Nagpur Manager</span>
                <p className="text-[10px] text-muted-foreground font-light">nagpur1@storeandshare.in</p>
              </div>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">manager123</span>
            </div>

            {/* Delhi Manager */}
            <div 
              onClick={() => copyCreds("delhi1@storeandshare.in", "manager123")}
              className="p-2 border border-slate-900 rounded-lg hover:border-emerald-600/40 bg-zinc-950/40 cursor-pointer flex justify-between items-center transition-colors group"
            >
              <div>
                <span className="font-semibold text-emerald-400 group-hover:text-emerald-300">Delhi Manager</span>
                <p className="text-[10px] text-muted-foreground font-light">delhi1@storeandshare.in</p>
              </div>
              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">manager123</span>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        <Suspense fallback={<div className="text-sm text-emerald-400">Loading form parameters...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-muted-foreground w-full">
        <p>© 2026 Store & Share Platform. Authorized credentials gate.</p>
      </footer>
    </div>
  );
}
