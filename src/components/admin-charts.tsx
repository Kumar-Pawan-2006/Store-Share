"use client";

import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart as ChartIcon, PieChart as PieIcon } from "lucide-react";

export interface MonthlyTrendData {
  month: string;
  societyRevenue: number;
  companyRevenue: number;
}

export interface StreamBreakdownData {
  name: string;
  value: number;
}

const COLORS = ["#10b981", "#f59e0b", "#0ea5e9"];

export function AdminCharts({ 
  trendData, 
  breakdownData 
}: { 
  trendData: MonthlyTrendData[]; 
  breakdownData: StreamBreakdownData[]; 
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Portfolio Growth Trend Line Chart */}
      <Card className="border border-slate-900 bg-card-dark lg:col-span-8 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ChartIcon className="h-5 w-5 text-accent" />
            Monthly Growth Portfolio Collective Revenue
          </CardTitle>
          <CardDescription>
            Comparing total billing baseline margins vs company revenue splits
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-72 w-full">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }} className="font-sans text-[11px]">
                  <CartesianGrid strokeDasharray="3 3" stroke="#162e29" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f2b25", border: "1px solid #10b981", borderRadius: "8px" }}
                    itemStyle={{ color: "#d1d5db" }}
                  />
                  <Legend />
                  <Line type="monotone" name="Society Earnings share" dataKey="societyRevenue" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Store & Share (40% Share)" dataKey="companyRevenue" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                Loading line visualizations...
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Streams Pie Chart */}
      <Card className="border border-slate-900 bg-card-dark lg:col-span-4 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-accent animate-pulse" />
            Revenue Breakdown by Stream
          </CardTitle>
          <CardDescription>Share distribution among channels</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-56 w-full relative flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart className="font-sans text-[11px]">
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f2b25", border: "1px solid #10b981", borderRadius: "8px" }}
                    formatter={(v) => formatCurrency(Number(v))}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">Loading pie charts...</div>
            )}
            
            {/* Center Label */}
            {isMounted && (
              <div className="absolute flex flex-col items-center justify-center font-bold">
                <span className="text-[10px] text-muted-foreground uppercase leading-none">TOTAL MARGIN</span>
                <span className="text-base text-slate-100 mt-1">₹{(breakdownData.reduce((sum, item) => sum + item.value, 0) / 1000).toFixed(0)}k</span>
              </div>
            )}
          </div>

          {/* Simple Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-3 text-[10px] uppercase font-bold tracking-wider">
            {breakdownData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span>{d.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
