import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Navbar } from "@/components/navbar";
import { DashboardChart } from "@/components/dashboard-chart";
import { AdminSocietyEdit } from "@/components/admin-society-edit";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ShieldCheck, ArrowLeft, Sun, BatteryCharging, Heart, 
  Calendar, CheckCircle, Clock, AlertTriangle, Key, 
  Settings, Award, Coins
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:5000";

// Custom helper to check if backend is online
async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/health`, { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      return { online: true, databaseOffline: data.databaseOffline };
    }
  } catch (e) {}
  return { online: false, databaseOffline: true };
}

export default async function AdminSocietyDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  // Guard: Admin role required
  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 items-center justify-center text-center p-6">
        <ShieldCheck className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-sm max-w-xs mt-2 mb-4 font-light">
          Administrator privileges are required to view society properties.
        </p>
        <Link href="/login" className="inline-flex px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm">
          Return to Sign In
        </Link>
      </div>
    );
  }

  // Check backend health
  const health = await checkBackendHealth();
  let society: any = null;
  let errorMsg: string | null = null;

  if (!health.online) {
    errorMsg = "Backend API server is offline. Please make sure the backend is running on port 5000.";
  } else if (health.databaseOffline) {
    errorMsg = "Neon Database connection is missing on the Backend. Please verify DATABASE_URL is set in backend configurations.";
  } else {
    try {
      const res = await fetch(`${BACKEND_URL}/api/societies/${params.id}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        errorMsg = "Society profile could not be located in database. It may have been deleted.";
      } else {
        society = await res.json();
      }
    } catch (e: any) {
      console.error("Failed to query society profile:", e);
      errorMsg = "Database query failed. Ensure Neon Postgres is reachable.";
    }
  }

  // Graceful DB Offline display
  if (errorMsg) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar dbOffline={true} />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-16 w-16 text-rose-500 mb-6 animate-pulse" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">Error Accessing Profile</h1>
          <div className="p-6 bg-rose-955 text-rose-300 border border-rose-500/20 rounded-xl leading-relaxed text-sm max-w-xl mb-6">
            <strong>Admin Action Error:</strong> {errorMsg}
          </div>
          <Link href="/admin" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/95 transition-colors">
            Back to Admin Panel
          </Link>
        </main>
      </div>
    );
  }

  // Calculate metrics
  const transactions = society.revenueTransactions || [];
  const latestTx = transactions[0] || null; // Sorted desc
  const currentMonthEarning = latestTx ? latestTx.customerEarning : 0;
  const currentMonthBaselineLoss = latestTx ? latestTx.baselineValue : 0;
  const ytdSavings = transactions.reduce((sum: number, tx: any) => sum + tx.customerEarning, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatMonthName = (dateStr: string | Date) => {
    return new Date(dateStr).toLocaleString("en-IN", { month: "long", year: "numeric" });
  };

  const battery = society.batteryUnit;
  const amc = society.amcContracts?.[0] || null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        
        {/* Back Link */}
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors">
          <ArrowLeft className="h-4 w-4 text-accent" />
          Back to Admin Operations Panel
        </Link>

        {/* Info Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-emerald-955 text-slate-100 p-6 rounded-2xl relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/20">
                {society.city} CHAPTER
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {society.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{society.name} Profiles</h1>
            <p className="text-muted-foreground text-sm">
              Society contact person: <strong className="text-slate-200">{society.contactPersonName}</strong> • {society.contactEmail} • {society.contactPhone}
            </p>
          </div>
          <div className="text-[10px] text-muted-foreground bg-zinc-955 p-3 rounded-lg border border-slate-900 border-dashed">
            Onboarded: <strong className="text-slate-100">{new Date(society.onboardedAt).toLocaleDateString("en-IN")}</strong>
          </div>
        </div>

        {/* Core Double Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Configurations Editor (Col span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <AdminSocietyEdit society={society} />
          </div>

          {/* Right Panel: Society dashboards views (Col span 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top metrics summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border border-slate-900 bg-slate-900/30">
                <CardContent className="pt-5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                    YTD Shared Savings
                  </span>
                  <div className="text-2xl font-bold text-emerald-400">
                    {formatCurrency(ytdSavings)}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1.5 border-t border-emerald-950/20 pt-1">
                    Total direct credit splits released.
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-900 bg-slate-900/30">
                <CardContent className="pt-5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                    Avg Daily Surplus
                  </span>
                  <div className="text-2xl font-bold text-slate-100">
                    {society.dailySurplusUnits} kWh
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-1.5 border-t border-emerald-950/20 pt-1">
                    Solar production average parameters.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Display Telemetry Chart */}
            <DashboardChart readings={society.energyReadings} />

            {/* Billing List */}
            <Card className="border border-slate-900 bg-card-dark shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Historical Splits Ledger</CardTitle>
                <CardDescription>Monthly billing calculations records</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="text-xs mb-0">
                    <TableHeader className="bg-slate-900/50">
                      <TableRow>
                        <TableHead>Billing Month</TableHead>
                        <TableHead className="text-right">Baseline</TableHead>
                        <TableHead className="text-right">Optimized</TableHead>
                        <TableHead className="text-right">Society split</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length > 0 ? (
                        transactions.map((tx: any) => (
                          <TableRow key={tx.id}>
                            <TableCell className="font-semibold">{formatMonthName(tx.date)}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{formatCurrency(tx.baselineValue)}</TableCell>
                            <TableCell className="text-right text-accent font-semibold">{formatCurrency(tx.platformValue)}</TableCell>
                            <TableCell className="text-right text-emerald-400 font-bold">{formatCurrency(tx.customerEarning)}</TableCell>
                            <TableCell className="text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                tx.payoutStatus === "PAID" 
                                  ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20" 
                                  : "bg-amber-955 text-accent border-accent/20"
                              }`}>
                                {tx.payoutStatus}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No billing records generated for this society.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Battery / AMC Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Battery card */}
              <Card className="border border-slate-900 bg-slate-900/30">
                <CardContent className="pt-4 space-y-2">
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Storage Bank Status</span>
                  {battery ? (
                    <>
                      <div className="flex justify-between items-center text-xs">
                        <strong className="text-slate-100">{battery.capacityKwh} kWh Capacity</strong>
                        <span className="text-emerald-400 text-[10px] font-bold bg-emerald-950/20 px-1 rounded border border-emerald-500/20">
                          {battery.healthStatus}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Deployed partner: {battery.manufacturerPartner}</p>
                    </>
                  ) : (
                    <div className="text-muted-foreground text-[10px]">No battery bank deployed.</div>
                  )}
                </CardContent>
              </Card>

              {/* AMC contract card */}
              <Card className="border border-slate-900 bg-slate-900/30">
                <CardContent className="pt-4 space-y-2">
                  <span className="text-[10px] text-muted-foreground uppercase block font-bold">Service AMC Contract</span>
                  {amc ? (
                    <>
                      <div className="flex justify-between items-center">
                        <strong className="text-emerald-400">{formatCurrency(amc.monthlyFee)} / mo</strong>
                        <span className="text-emerald-400 text-[10px] font-bold bg-emerald-900/10 px-1.5 rounded">
                          {amc.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">Renewal Scheduled: {new Date(amc.renewalDate).toLocaleDateString("en-IN")}</p>
                    </>
                  ) : (
                    <div className="text-muted-foreground text-[10px]">No active AMC contract.</div>
                  )}
                </CardContent>
              </Card>

            </div>

          </div>

        </div>

      </main>

      <footer className="mt-14 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-muted-foreground w-full">
        <p>© 2026 Store & Share Platform. Society parameters configuration tool.</p>
      </footer>
    </div>
  );
}
