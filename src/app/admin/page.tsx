import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Navbar } from "@/components/navbar";
import { db } from "@/lib/db";
import { AdminCharts, MonthlyTrendData, StreamBreakdownData } from "@/components/admin-charts";
import { LeadStatusSelect } from "@/components/lead-status-select";
import { AdminScaleProjector } from "@/components/admin-scale-projector";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Building, ShieldCheck, Mail, Database, Terminal, 
  IndianRupee, Zap, Network, PlusCircle, Pencil, Info
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  // Guard: Admin Role Required
  if (!session || session.user.role !== "ADMIN") {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 items-center justify-center text-center p-6">
        <ShieldCheck className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-sm max-w-xs mt-2 mb-4">
          You must be logged in as an administrator to access this area.
        </p>
        <Link href="/login" className="inline-flex px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm">
          Return to Sign In
        </Link>
      </div>
    );
  }

  const dbOffline = !process.env.DATABASE_URL;
  let societies: any[] = [];
  let leads: any[] = [];
  let errorMsg: string | null = null;

  if (dbOffline) {
    errorMsg = "Database variables are missing. Please configure DATABASE_URL to access B2B and portfolio tables.";
  } else {
    try {
      // Query societies, energy history, monthly billing, and contracts
      societies = await db.society.findMany({
        include: {
          revenueTransactions: true,
          energyReadings: true,
          amcContracts: true,
        },
        orderBy: { onboardedAt: "desc" },
      });

      // Query CRM business leads
      leads = await db.b2BLead.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (e: any) {
      console.error("Admin dashboard database fetch failed:", e);
      errorMsg = "Prisma query failed. Check if migrations are deploved and Neon database is configured.";
    }
  }

  // Graceful DB Offline display
  if (errorMsg) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar dbOffline={true} />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <Terminal className="h-16 w-16 text-rose-500 mb-6 animate-pulse" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">Database Migration Pending</h1>
          <div className="p-6 bg-rose-950/20 border border-rose-500/20 rounded-xl leading-relaxed text-sm text-rose-300 max-w-xl mb-6">
            <strong>Admin Panel Error:</strong> {errorMsg}
          </div>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">
            This live admin panel requires a connection to Vercel/Neon Postgres. Run the local seed command <code className="bg-slate-900 px-1 py-0.5 rounded text-primary text-xs">npm run db:seed</code> to set up credentials and populate societies.
          </p>
          <Link href="/" className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm hover:bg-slate-800 transition-colors">
            Return Home
          </Link>
        </main>
      </div>
    );
  }

  // 1. Calculate general portfolio aggregates
  const totalSocieties = societies.length;
  
  // Calculate total MWh energy optimized (generated surplus units / 1000)
  const totalUnitsOptimized = societies.reduce(
    (sum, s) => sum + s.energyReadings.reduce((innerSum: number, r: any) => innerSum + r.surplusUnitsGenerated, 0), 
    0
  );
  const totalMWh = Math.round((totalUnitsOptimized / 1000) * 10) / 10;

  // Aggregate monthly billing trends (society vs company share)
  const monthlyAggregates: { [monthKey: string]: { month: string; societyRev: number; companyRev: number; rawDate: Date } } = {};
  
  societies.forEach(s => {
    s.revenueTransactions.forEach((tx: any) => {
      const d = new Date(tx.date);
      const monthKey = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      if (!monthlyAggregates[monthKey]) {
        monthlyAggregates[monthKey] = { month: monthKey, societyRev: 0, companyRev: 0, rawDate: d };
      }
      monthlyAggregates[monthKey].societyRev += tx.customerEarning + tx.baselineValue;
      monthlyAggregates[monthKey].companyRev += tx.companyRevenue;
    });
  });

  const trendData: MonthlyTrendData[] = Object.values(monthlyAggregates)
    .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
    .map(val => ({
      month: val.month,
      societyRevenue: Math.round(val.societyRev),
      companyRevenue: Math.round(val.companyRev),
    }));

  // Find latest active month's company revenue from aggregated trends
  const latestTrend = trendData[trendData.length - 1];
  const totalMonthlyCompanyRev = latestTrend ? latestTrend.companyRevenue : 0;

  // Calculate active AMC monthly fee sum
  const totalActiveAMCFees = societies.reduce((sum, s) => {
    const activeAMCs = s.amcContracts.filter((c: any) => c.status === "ACTIVE");
    return sum + activeAMCs.reduce((innerSum: number, c: any) => innerSum + c.monthlyFee, 0);
  }, 0);

  // Revenue Streams Breakdown Data:
  // - Arbitrage Revenue (actual computed for latest month)
  // - AMC monthly fees
  // - Software Licensing (placeholder value representing B2B SaaS model)
  const breakdownData: StreamBreakdownData[] = [
    { name: "Arbitrage Revenue Share", value: totalMonthlyCompanyRev },
    { name: "AMC Contract Fees", value: totalActiveAMCFees },
    { name: "SaaS Software License (Est.)", value: 120000 },
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Operations Panel</h1>
            <p className="text-muted-foreground text-sm">
              Portfolio metrics, regional statistics, B2B leads, and optimization streams.
            </p>
          </div>
          <div className="text-xs bg-slate-900 border border-slate-800 p-3 rounded-lg text-muted-foreground">
            Session: <strong className="text-slate-200">Aditya Sharma (Global Admin)</strong> • Nagpur/Patna/Delhi
          </div>
        </div>

        {/* Global KPI Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Societies Count */}
          <Card className="border border-slate-900 bg-card-dark shadow-md">
            <CardHeader className="py-4 pb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Total Managed Societies
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold">{totalSocieties} Sites</span>
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {societies.filter(s => s.status === "ACTIVE").length} Active
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Nagpur, Patna and Delhi regions</p>
            </CardContent>
          </Card>

          {/* Card 2: Cumulative Energy Managed */}
          <Card className="border border-slate-900 bg-card-dark shadow-md">
            <CardHeader className="py-4 pb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Cumulative Energy Managed
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold flex items-center gap-1">
                  <Zap className="h-6 w-6 text-accent animate-pulse" />
                  {totalMWh} MWh
                </span>
                <span className="text-xs text-muted-foreground">75-Day History</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Daily telemetry records aggregated</p>
            </CardContent>
          </Card>

          {/* Card 3: Monthly Company Revenue share */}
          <Card className="border border-accent/20 bg-card-dark shadow-md">
            <CardHeader className="py-4 pb-2">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block">
                Aggregate Monthly Revenue
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-accent">
                  {formatCurrency(totalMonthlyCompanyRev + totalActiveAMCFees + 120000)}
                </span>
                <span className="text-xs text-amber-500 bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  40% Split + AMC
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Arbitrage, AMC, and SaaS streams combined</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Container */}
        <AdminCharts trendData={trendData} breakdownData={breakdownData} />

        {/* Society Portfolio Table */}
        <Card className="border border-slate-900 bg-card-dark shadow-xl">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Society Portfolio Configuration</CardTitle>
              <span className="text-xs text-muted-foreground">
                Detailed listing of registered housing complex projects. Click Edit icon to view notes and customize.
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="text-xs mb-0">
                <TableHeader className="bg-slate-900/50">
                  <TableRow>
                    <TableHead>Society Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Density / Solar</TableHead>
                    <TableHead className="text-right">Surplus Units</TableHead>
                    <TableHead className="text-right">Arbitrage Earned</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {societies.length > 0 ? (
                    societies.map((s: any) => {
                      // sum company revenue
                      const companyShareSum = s.revenueTransactions.reduce((acc: number, tx: any) => acc + tx.companyRevenue, 0);
                      return (
                        <TableRow key={s.id} className="hover:bg-slate-900/40">
                          <TableCell>
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-[10px] text-muted-foreground font-light">{s.contactPersonName} • {s.contactPhone}</div>
                          </TableCell>
                          <TableCell>{s.city}</TableCell>
                          <TableCell className="text-right">
                            <div>{s.flatCount} Flats</div>
                            <div className="text-[10px] text-muted-foreground font-light">{s.rooftopSolarKw} kWp Solar</div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {s.dailySurplusUnits} units/day
                          </TableCell>
                          <TableCell className="text-right text-emerald-400 font-bold">
                            {formatCurrency(companyShareSum)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              s.status === "ACTIVE" 
                                ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20" 
                                : s.status === "ONBOARDING"
                                ? "bg-amber-950/20 text-accent border-accent/20"
                                : "bg-rose-950/35 text-rose-500 border-rose-500/20"
                            }`}>
                              {s.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Link href={`/admin/society/${s.id}`}>
                              <span className="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-primary/50 text-slate-300 hover:text-slate-100 px-2 py-1 rounded text-[10px] cursor-pointer font-semibold">
                                <Pencil className="h-3 w-3 text-accent" />
                                Edit/Details
                              </span>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No housing societies registered. Ensure database is seeded.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Lead Management & Projector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CRM Leads Table */}
          <Card className="border border-slate-900 bg-card-dark lg:col-span-6 shadow-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent" />
                CRM B2B Contact Leads
              </CardTitle>
              <span className="text-[11px] text-muted-foreground">
                Inbound requests captured from the public landing CRM screen.
              </span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="text-xs mb-0">
                  <TableHeader className="bg-slate-900/50">
                    <TableRow>
                      <TableHead>Company Detail</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead className="text-center">Update Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.length > 0 ? (
                      leads.map((l: any) => (
                        <TableRow key={l.id} className="hover:bg-slate-900/40">
                          <TableCell>
                            <div className="font-semibold text-slate-200">{l.companyName}</div>
                            <div className="text-[10px] text-emerald-450 leading-tight block">{l.contactEmail}</div>
                            {l.notes && <div className="text-[10px] text-muted-foreground mt-1 max-w-xs">{l.notes}</div>}
                          </TableCell>
                          <TableCell>
                            <span className="px-1.5 py-0.5 bg-slate-900 text-[10px] rounded text-slate-300 font-semibold border border-slate-800">
                              {l.interestType.replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-center py-3">
                            <LeadStatusSelect leadId={l.id} currentStatus={l.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          No B2B leads captured yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Scale Projector Widget */}
          <div className="lg:col-span-6 bg-zinc-950 p-0 rounded-2xl">
            <AdminScaleProjector currentMonthlyRev={totalMonthlyCompanyRev} />
          </div>

        </div>

      </main>

      <footer className="mt-14 border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-muted-foreground w-full">
        <p>© 2026 Store & Share Platform. Global admin panel credentials verified.</p>
      </footer>
    </div>
  );
}
