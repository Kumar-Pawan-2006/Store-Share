"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { calculateRevenue } from "@/lib/calc";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { 
  Sun, Settings, IndianRupee, TrendingUp, HelpCircle, 
  Building, Percent, Coins, ArrowRightLeft 
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CalculatorPage() {
  const [flatCount, setFlatCount] = useState(80);
  const [rooftopSolarKw, setRooftopSolarKw] = useState(60);
  const [dailySurplusUnits, setDailySurplusUnits] = useState(150);
  const [netMeteringRate, setNetMeteringRate] = useState(2.0);
  const [discomImportRate, setDiscomImportRate] = useState(8.5);
  const [customerSplit, setCustomerSplit] = useState(60);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const companySplit = 100 - customerSplit;

  // Calculate results using standard engine
  const results = calculateRevenue({
    flatCount,
    rooftopSolarKw,
    dailySurplusUnits,
    netMeteringRate,
    discomImportRate,
    revenueSplitCustomerPct: customerSplit,
    revenueSplitCompanyPct: companySplit,
  });

  const chartData = [
    {
      name: "Old Loop",
      "Net Metering Income": Math.round(results.baselineMonthlyValue),
      "Value Lost to Grid": Math.round(results.extraValueCreatedMonthly),
    },
    {
      name: "Store & Share",
      "Net Metering Income": Math.round(results.baselineMonthlyValue),
      "Housing Society Slice (60%)": Math.round(results.customerMonthlyEarning),
      "Store & Share Fee (40%)": Math.round(results.companyMonthlyRevenue),
    }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-accent selection:text-accent-foreground">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Solar Optimization ROI Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Simulate your society's monthly returns. Drag sliders to adjust flat counts, solar output capacity, net-metering baselines, and local DISCOM tariffs.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Input Panel */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-emerald-950/40 bg-card-dark shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-accent" />
                  Society Parameters
                </CardTitle>
                <CardDescription>Adjust the configurations of your housing solar crop.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Flat Count */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Building className="h-4 w-4" /> Flat Count
                    </span>
                    <span className="text-foreground">{flatCount} Flats</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    value={flatCount}
                    onChange={(e) => setFlatCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* Rooftop Solar Kw */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Sun className="h-4 w-4" /> Rooftop Solar Capacity (kW)
                    </span>
                    <span className="text-foreground">{rooftopSolarKw} kWp</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="400"
                    value={rooftopSolarKw}
                    onChange={(e) => setRooftopSolarKw(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* Daily Surplus Units */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" /> Daily Solar Surplus (kWh)
                    </span>
                    <span className="text-foreground">{dailySurplusUnits} Units</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="800"
                    value={dailySurplusUnits}
                    onChange={(e) => setDailySurplusUnits(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                <div className="border-t border-emerald-950/40 my-4" />

                {/* Net Metering Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" /> Net Metering Rate (₹/Unit)
                    </span>
                    <span className="text-foreground">₹{netMeteringRate} / unit</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={netMeteringRate}
                    onChange={(e) => setNetMeteringRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* DISCOM Import Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <ArrowRightLeft className="h-4 w-4" /> DISCOM Import Tariff (₹/Unit)
                    </span>
                    <span className="text-foreground">₹{discomImportRate} / unit</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="15.0"
                    step="0.1"
                    value={discomImportRate}
                    onChange={(e) => setDiscomImportRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

                {/* Customer Revenue Share Split */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Percent className="h-4 w-4" /> Society Revenue Slice
                    </span>
                    <span className="text-foreground">{customerSplit}% Share</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="80"
                    value={customerSplit}
                    onChange={(e) => setCustomerSplit(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Results Summary and Chart */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top metrics grids */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Baseline earnings */}
              <Card className="border border-slate-900 bg-slate-900/40">
                <CardContent className="pt-6">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block mb-1">
                    Old Baseline Earning
                  </span>
                  <div className="text-2xl font-bold flex items-center">
                    {formatCurrency(results.baselineMonthlyValue)}
                    <span className="text-xs text-muted-foreground font-normal ml-1">/mo</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-2 border-t border-emerald-950/20 pt-1">
                    Midday export returns
                  </div>
                </CardContent>
              </Card>

              {/* Extra Value Created */}
              <Card className="border border-accent/25 bg-amber-950/10">
                <CardContent className="pt-6">
                  <span className="text-xs font-semibold text-accent uppercase tracking-widest block mb-1">
                    Total Value Arbitrage
                  </span>
                  <div className="text-2xl font-bold text-accent flex items-center">
                    {formatCurrency(results.extraValueCreatedMonthly)}
                    <span className="text-xs text-amber-500/60 font-normal ml-1">/mo</span>
                  </div>
                  <div className="text-[10px] text-amber-500/50 mt-2 border-t border-amber-950/20 pt-1">
                    Gross optimization savings
                  </div>
                </CardContent>
              </Card>

              {/* New Earnings Share */}
              <Card className="border border-emerald-500/30 bg-emerald-950/10">
                <CardContent className="pt-6 font-semibold">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
                    Society Earnings (60%)
                  </span>
                  <div className="text-2xl font-bold text-emerald-400 flex items-center">
                    {formatCurrency(results.baselineMonthlyValue + results.customerMonthlyEarning)}
                    <span className="text-xs text-emerald-500/60 font-normal ml-1">/mo</span>
                  </div>
                  <div className="text-[10px] text-emerald-500/50 mt-2 border-t border-emerald-950/20 pt-1">
                    Net monthly benefit
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Calculations Explanation Alert */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-950/30 rounded-xl leading-relaxed text-xs text-emerald-250 flex items-start gap-3">
              <Coins className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <strong>Earnings Jump details: </strong> Previously, society earned ₹{results.baselineDailyValue.toFixed(0)}/day. In the Store & Share storage loops, the common areas offset ₹{results.platformDailyValue.toFixed(0)}/day of grid imports. 
                This yields an extra ₹{results.extraValueCreatedDaily.toFixed(0)}/day margin. The society pockets 60% of this premium (₹{results.customerDailyEarning.toFixed(0)}/day) PLUS the original net-metering baseline. 
                Your net returns jump by <strong className="text-emerald-400 font-bold">{( ((results.customerDailyEarning) / results.baselineDailyValue) * 100 ).toFixed(0)}%</strong>!
              </div>
            </div>

            {/* Recharts Projections Card */}
            <Card className="border border-slate-900 bg-card-dark">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Monthly Income Structure comparison</CardTitle>
                <CardDescription>Visualizing Net metering vs Store & Share share splits</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-72 w-full">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                        className="font-sans text-xs"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#162e29" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${v}`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0f2b25", border: "1px solid #10b981", borderRadius: "8px" }}
                          itemStyle={{ color: "#d1d5db" }}
                        />
                        <Legend />
                        <Bar dataKey="Net Metering Income" stackId="a" fill="#0d5c4d" />
                        <Bar dataKey="Housing Society Slice (60%)" stackId="a" fill="#10b981" />
                        <Bar dataKey="Store & Share Fee (40%)" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="Value Lost to Grid" stackId="a" fill="#9f1239" opacity={0.6} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      Rendering projection chart...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-muted-foreground w-full">
        <p>© 2026 Store & Share Platform. Real-time billing calculators module.</p>
      </footer>
    </div>
  );
}
