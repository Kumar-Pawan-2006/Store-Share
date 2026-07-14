"use client";

import React, { useState, useMemo } from "react";
import { calculateRevenue } from "@/lib/calc";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { 
  Building2, Users, IndianRupee, Zap, Gauge, 
  HelpCircle, Sparkles, Network 
} from "lucide-react";

export function AdminScaleProjector({ currentMonthlyRev = 0 }) {
  const [targetSocieties, setTargetSocieties] = useState(15);
  const [avgFlats, setAvgFlats] = useState(80);
  const [avgSolarKw, setAvgSolarKw] = useState(60);
  const [avgSurplusUnits, setAvgSurplusUnits] = useState(160);
  const [companyPctShared, setCompanyPctShared] = useState(40);

  const projection = useMemo(() => {
    const singleResults = calculateRevenue({
      flatCount: avgFlats,
      rooftopSolarKw: avgSolarKw,
      dailySurplusUnits: avgSurplusUnits,
      netMeteringRate: 2.0,      // Baseline average
      discomImportRate: 8.5,     // Baseline DISCOM import average
      revenueSplitCustomerPct: 100 - companyPctShared,
      revenueSplitCompanyPct: companyPctShared,
    });

    return {
      monthly: singleResults.companyMonthlyRevenue * targetSocieties,
      annual: singleResults.companyAnnualRevenue * targetSocieties,
      totalExtraValueCreated: singleResults.extraValueCreatedMonthly * targetSocieties,
    };
  }, [targetSocieties, avgFlats, avgSolarKw, avgSurplusUnits, companyPctShared]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const chartData = [
    {
      name: "Current Revenue",
      "Monthly Income": Math.round(currentMonthlyRev),
    },
    {
      name: `Projected (${targetSocieties} Societies)`,
      "Monthly Income": Math.round(projection.monthly),
    }
  ];

  return (
    <Card className="border border-slate-900 bg-card-dark shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Network className="h-5 w-5 text-accent" />
          Interactive Portfolio Scaling Projector
        </CardTitle>
        <CardDescription>
          Simulate revenue scaling by onboarding societies across target regions.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls */}
          <div className="space-y-4">
            
            {/* Target Societies */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Societies to Onboard</span>
                <span>{targetSocieties} Sites</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={targetSocieties}
                onChange={(e) => setTargetSocieties(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            {/* Avg Flat Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Avg Flat Density</span>
                <span>{avgFlats} Flats</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                value={avgFlats}
                onChange={(e) => setAvgFlats(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            {/* Avg Solar kW */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1"><Zap className="h-3.5 w-3.5 animate-pulse" /> Avg Solar capacity (kW)</span>
                <span>{avgSolarKw} kWp</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                value={avgSolarKw}
                onChange={(e) => setAvgSolarKw(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            {/* Avg Daily Surplus */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> Daily surplus solar (kWh)</span>
                <span>{avgSurplusUnits} Units</span>
              </div>
              <input
                type="range"
                min="30"
                max="600"
                value={avgSurplusUnits}
                onChange={(e) => setAvgSurplusUnits(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

            {/* Company Split */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5 text-emerald-500" /> Store & Share split (%)</span>
                <span>{companyPctShared}% Company Share</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                value={companyPctShared}
                onChange={(e) => setCompanyPctShared(parseInt(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>

          </div>

          {/* Results Summary */}
          <div className="space-y-6 flex flex-col justify-between">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 border border-emerald-950/20 rounded-xl">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider mb-1">
                  Collective Monthly Rev
                </span>
                <div className="text-xl font-bold text-accent">
                  {formatCurrency(projection.monthly)}
                </div>
                <span className="text-[9px] text-muted-foreground">Company 40% Share</span>
              </div>

              <div className="bg-slate-900/50 p-4 border border-emerald-950/20 rounded-xl">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-wider mb-1">
                  Collective Annual Rev
                </span>
                <div className="text-xl font-bold text-emerald-400">
                  {formatCurrency(projection.annual)}
                </div>
                <span className="text-[9px] text-muted-foreground">Annualized Returns</span>
              </div>
            </div>

            {/* Recharts scaling visualization */}
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} className="font-sans text-[10px]" margin={{ left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#162e29" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f2b25", border: "1px solid #10b981" }}
                    itemStyle={{ color: "#d1d5db" }}
                  />
                  <Bar dataKey="Monthly Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </CardContent>
    </Card>
  );
}
