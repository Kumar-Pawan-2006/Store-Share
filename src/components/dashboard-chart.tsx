"use client";

import React, { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export interface DBChartReading {
  date: string; // ISO string or representation
  surplusUnitsGenerated: number;
  unitsStoredInBattery: number;
  unitsUsedFromBattery: number;
  unitsExportedToGrid: number;
}

export function DashboardChart({ readings }: { readings: DBChartReading[] }) {
  const [days, setDays] = useState(30);

  const processedData = useMemo(() => {
    // Sort in ascending order by date
    const sorted = [...readings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // Get last N items
    return sorted.slice(-days).map(r => ({
      ...r,
      formattedDate: new Date(r.date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    }));
  }, [readings, days]);

  return (
    <Card className="border border-slate-900 bg-card-dark shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="text-lg font-bold">Daily Energy Telemetry</CardTitle>
          <CardDescription>Generated surplus solar energy vs battery storage charge & exports</CardDescription>
        </div>
        <div className="flex bg-slate-900/60 p-1 rounded-lg border border-emerald-950/20 text-xs font-semibold gap-1">
          <button
            onClick={() => setDays(30)}
            className={`px-3 py-1.5 rounded-md transition-colors ${days === 30 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDays(60)}
            className={`px-3 py-1.5 rounded-md transition-colors ${days === 60 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            60 Days
          </button>
          <button
            onClick={() => setDays(90)}
            className={`px-3 py-1.5 rounded-md transition-colors ${days === 90 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            All Logs
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-80 w-full">
          {processedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={processedData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                className="font-sans text-xs"
              >
                <defs>
                  <linearGradient id="colorGenerated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStored" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#162e29" />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(v) => `${v}u`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f2b25", border: "1px solid #10b981", borderRadius: "8px" }}
                  labelStyle={{ color: "#10b981", fontWeight: "bold" }}
                  itemStyle={{ color: "#d1d5db" }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  name="Surplus Generated (kWh)" 
                  dataKey="surplusUnitsGenerated" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorGenerated)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  name="Stored in Battery (kWh)" 
                  dataKey="unitsStoredInBattery" 
                  stroke="#f59e0b" 
                  fillOpacity={1} 
                  fill="url(#colorStored)" 
                  strokeWidth={1.5}
                />
                <Area 
                  type="monotone" 
                  name="Used from Battery (kWh)" 
                  dataKey="unitsUsedFromBattery" 
                  stroke="#fb923c" 
                  strokeDasharray="4 4"
                  fill="none" 
                  strokeWidth={1.5}
                />
                <Area 
                  type="monotone" 
                  name="Exported directly (kWh)" 
                  dataKey="unitsExportedToGrid" 
                  stroke="#0ea5e9"
                  fill="none" 
                  strokeWidth={1}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-xs text-muted-foreground">
              <Calendar className="h-8 w-8 text-slate-800 mb-2 animate-bounce" />
              <span>No telemetry logs loaded for this range.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
