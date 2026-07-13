import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { Navbar } from "@/components/navbar";
import { db } from "@/lib/db";
import { DashboardChart } from "@/components/dashboard-chart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ShieldAlert, Sparkles, BatteryCharging, Heart, 
  Calendar, CheckCircle, Clock, AlertTriangle, Key, 
  Settings, Award, Coins
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 items-center justify-center text-center p-6">
        <ShieldAlert className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground text-sm max-w-xs mt-2 mb-4">You must be signed in to view this page.</p>
        <Link href="/login" className="inline-flex px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm">
          Go to Sign In
        </Link>
      </div>
    );
  }

  // Handle DB offline scenario gracefully
  const dbOffline = !process.env.DATABASE_URL;
  let errorMsg: string | null = null;
  let society: any = null;

  if (dbOffline) {
    errorMsg = "Database Connection Missing. Please verify DATABASE_URL is set in your Vercel/local configuration.";
  } else {
    try {
      if (!session.user.societyId) {
        errorMsg = "No housing society is currently associated with this login. Please contact our support team.";
      } else {
        society = await db.society.findUnique({
          where: { id: session.user.societyId },
          include: {
            batteryUnit: true,
            amcContracts: true,
            revenueTransactions: {
              orderBy: { date: "desc" },
            },
            energyReadings: {
              orderBy: { date: "asc" },
            }
          }
        });

        if (!society) {
          errorMsg = "Linked housing society could not be found in the database. Ensure seed script has run.";
        }
      }
    } catch (e: any) {
      console.error("Database query failed:", e);
      errorMsg = "Database query error. Ensure database migrations have been successfully deployed.";
    }
  }

  // If error occurred, show rich warning page
  if (errorMsg) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar dbOffline={true} />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-16 w-16 text-amber-500 mb-6 animate-pulse" />
          <h1 className="text-3xl font-extrabold tracking-tight mb-4">Configuration Required</h1>
          <div className="p-6 bg-amber-950/20 border border-amber-500/20 rounded-xl leading-relaxed text-sm text-amber-300 max-w-xl mb-6">
            <strong>Platform Alert:</strong> {errorMsg}
          </div>
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed mb-6">
            If you are hosting this demo, ensure environment variables are configured. Run <code className="bg-slate-900 px-1.5 py-0.5 rounded text-primary text-xs">npm run db:migrate</code> and <code className="bg-slate-900 px-1.5 py-0.5 rounded text-primary text-xs">npm run db:seed</code> locally to populate the database.
          </p>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm hover:bg-slate-800 transition-colors">
              Return Home
            </Link>
            <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:bg-primary/90 transition-colors">
              Try Another Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Calculate specific metrics
  const transactions = society.revenueTransactions || [];
  const latestTx = transactions[0] || null; // Sorted desc
  const currentMonthEarning = latestTx ? latestTx.customerEarning : 0;
  const currentMonthBaselineLoss = latestTx ? latestTx.baselineValue : 0;
  const currentMonthPlatformValue = latestTx ? latestTx.platformValue : 0;

  // YTD Savings (sum of all customerEarning)
  const ytdSavings = transactions.reduce((sum: number, tx: any) => sum + tx.customerEarning, 0);

  // Next Payout
  let nextPayoutAmount = 0;
  let nextPayoutStatus = "No transactions";
  let nextPayoutDateLabel = "N/A";

  if (latestTx) {
    nextPayoutAmount = latestTx.customerEarning;
    nextPayoutStatus = latestTx.payoutStatus;
    
    // Set payout date to 10th of next month
    const txDate = new Date(latestTx.date);
    const payoutDate = new Date(txDate.getFullYear(), txDate.getMonth() + 1, 10);
    nextPayoutDateLabel = payoutDate.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-emerald-950/10 border border-emerald-900/20 p-6 rounded-2xl relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/20">
                {society.city} CHAPTER
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {society.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {society.name}
            </h1>
            <p className="text-muted-foreground text-sm bg-gradient-to-r from-emerald-500/10 to-transparent p-1 rounded">
              Address: {society.address} • Rooftop: {society.rooftopSolarKw} kWp • Flats: {society.flatCount}
            </p>
          </div>
          <div className="bg-slate-950/60 p-4 border border-emerald-950/30 rounded-xl flex items-center md:items-end flex-col justify-center shadow-inner">
            <span className="text-[10px] font-semibold text-emerald-500 tracking-wider">MANAGER ACCOUNT</span>
            <span className="text-sm font-semibold">{session.user.name}</span>
            <span className="text-[10px] text-muted-foreground">{session.user.email}</span>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Card 1: Last Month Earnings */}
          <Card className="border border-emerald-500/20 bg-card-dark relative overflow-hidden shadow-md">
            <CardHeader className="pb-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                This Month Earning share
              </span>
              <CardTitle className="text-3xl font-bold flex items-baseline">
                {formatCurrency(currentMonthEarning + currentMonthBaselineLoss)}
                <span className="text-xs text-muted-foreground font-normal ml-1">/mo</span>
              </CardTitle>
              <CardDescription className="text-xs text-emerald-250/70 pt-1 pointer-events-none">
                Old baseline return: <strong className="text-slate-300 font-semibold">{formatCurrency(currentMonthBaselineLoss)}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 p-2 rounded-lg leading-relaxed flex items-center gap-1.5 font-medium">
                <Sparkles className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>Arbitrage Optimization unlocked ₹{((currentMonthEarning / currentMonthBaselineLoss) * 100).toFixed(0)}% extra revenue.</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Cumulative YTD Savings */}
          <Card className="border border-slate-900 bg-card-dark shadow-md">
            <CardHeader className="pb-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                YTD Net Savings
              </span>
              <CardTitle className="text-3xl font-bold text-slate-100">
                {formatCurrency(ytdSavings)}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground pt-1 pointer-events-none">
                Cumulative direct credits since onboarding
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-[10px] text-muted-foreground bg-slate-900/60 p-2 rounded-lg leading-relaxed flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Shared solar battery setup requires ₹0 security deposit.</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Next Payout */}
          <Card className="border border-accent/20 bg-card-dark relative overflow-hidden shadow-md">
            <CardHeader className="pb-2">
              <span className="text-xs font-bold text-accent uppercase tracking-widest block mb-1">
                Next Net Payout
              </span>
              <CardTitle className="text-3xl font-bold text-accent">
                {formatCurrency(nextPayoutAmount)}
              </CardTitle>
              <CardDescription className="text-xs text-amber-500/50 pt-1 pointer-events-none">
                Expected due: <strong className="text-slate-100 font-semibold">{nextPayoutDateLabel}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-[10px] bg-amber-950/20 border border-amber-900/30 p-2 rounded-lg leading-relaxed flex items-center justify-between text-accent font-medium">
                <span className="flex items-center gap-1.5">
                  {nextPayoutStatus === "PAID" ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>Payout Released</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>Payout Pending</span>
                    </>
                  )}
                </span>
                <span className="bg-amber-900/50 px-2 py-0.5 rounded text-[9px] border border-amber-500/20">
                  {nextPayoutStatus}
                </span>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Telemetry charts */}
        <DashboardChart readings={society.energyReadings} />

        {/* Bottom grid (Battery Status, AMC + Revenue List) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Revenue history table (col span 7) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border border-slate-900 bg-card-dark shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Calculated Revenue History</CardTitle>
                <CardDescription>Month-by-month breakdown of solar optimization revenue</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="text-xs mb-0">
                    <TableHeader className="bg-slate-900/50">
                      <TableRow>
                        <TableHead>Billing Month</TableHead>
                        <TableHead className="text-right">Baseline Export</TableHead>
                        <TableHead className="text-right">Optimized Value</TableHead>
                        <TableHead className="text-right">Earning Slice (60%)</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length > 0 ? (
                        transactions.map((tx: any) => (
                          <TableRow key={tx.id} className="hover:bg-slate-900/40">
                            <TableCell className="font-semibold">{formatMonthName(tx.date)}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{formatCurrency(tx.baselineValue)}</TableCell>
                            <TableCell className="text-right text-accent font-semibold">{formatCurrency(tx.platformValue)}</TableCell>
                            <TableCell className="text-right text-emerald-400 font-bold">{formatCurrency(tx.customerEarning)}</TableCell>
                            <TableCell className="text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                                tx.payoutStatus === "PAID" 
                                  ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20" 
                                  : "bg-amber-950/20 text-accent border-accent/20 animate-pulse"
                              }`}>
                                {tx.payoutStatus}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No billing transactions are loaded yet.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cards (col span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Battery Health Card */}
            <Card className="border border-slate-900 bg-card-dark shadow-lg">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-1.5">
                    <BatteryCharging className="h-5 w-5 text-accent animate-pulse" />
                    Storage Bank Status
                  </CardTitle>
                  <CardDescription>On-premise battery physical telemetry</CardDescription>
                </div>
                {battery && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 leading-none ${
                    battery.healthStatus === "GOOD" 
                      ? "bg-emerald-950/30 text-emerald-400 border-emerald-500/25" 
                      : battery.healthStatus === "WARNING"
                      ? "bg-amber-950/30 text-accent border-accent/25"
                      : "bg-rose-950/35 text-rose-500 border-rose-500/25 animate-pulse"
                  }`}>
                    <Heart className="h-3 w-3 fill-current shrink-0" />
                    {battery.healthStatus}
                  </span>
                )}
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {battery ? (
                  <>
                    <div className="grid grid-cols-2 gap-4 pb-2 border-b border-emerald-950/20">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">CAPACITY</span>
                        <strong className="text-sm font-semibold">{battery.capacityKwh} kWh</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">DEPLOYED BY</span>
                        <strong className="text-sm font-semibold">{battery.manufacturerPartner}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">LAST MAINTENANCE</span>
                        <span className="flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{new Date(battery.lastServiceDate).toLocaleDateString("en-IN")}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">NEXT SERVICE DUE</span>
                        <span className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{new Date(battery.nextMaintenanceDue).toLocaleDateString("en-IN")}</span>
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Battery storage activation is currently onboarding.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AMC Status Card */}
            <Card className="border border-slate-900 bg-card-dark shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-1.5">
                  <Settings className="h-5 w-5 text-emerald-400" />
                  Service & AMC Contract
                </CardTitle>
                <CardDescription>Software and cell replacement contracts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                {amc ? (
                  <>
                    <div className="flex justify-between items-center pb-2 border-b border-emerald-950/20">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">MONTHLY FEE</span>
                        <strong className="text-sm font-semibold text-emerald-400">{formatCurrency(amc.monthlyFee)} / mo</strong>
                      </div>
                      <span className="bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[9px] font-bold text-primary-foreground uppercase">
                        {amc.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">CONTRACT START</span>
                        <span>{new Date(amc.startDate).toLocaleDateString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">RENEWAL DATE</span>
                        <span>{new Date(amc.renewalDate).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No active AMC contract found for this society. Deployed under platform lease default terms.
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

        </div>

      </main>

      <footer className="mt-14 border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-muted-foreground w-full">
        <p>© 2026 Store & Share Platform. Society manager portal credentials verified.</p>
      </footer>
    </div>
  );
}
