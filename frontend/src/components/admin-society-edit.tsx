"use client";

import React, { useState, useTransition } from "react";
import { updateSocietyAction, deleteSocietyAction } from "@/lib/actions/db-actions";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Status } from "@/types";
import { Save, Trash2, ShieldAlert, CheckCircle, Info } from "lucide-react";

export function AdminSocietyEdit({ society }: { society: any }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states initialized from society details
  const [flatCount, setFlatCount] = useState(society.flatCount);
  const [rooftopSolarKw, setRooftopSolarKw] = useState(society.rooftopSolarKw);
  const [dailySurplusUnits, setDailySurplusUnits] = useState(society.dailySurplusUnits);
  const [netMeteringRate, setNetMeteringRate] = useState(society.netMeteringRate);
  const [discomImportRate, setDiscomImportRate] = useState(society.discomImportRate);
  const [customerSplit, setCustomerSplit] = useState(society.revenueSplitCustomerPct);
  
  const [status, setStatus] = useState<Status>(society.status);
  const [internalNotes, setInternalNotes] = useState(society.internalNotes || "");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
 
    startTransition(async () => {
      try {
        const companySplit = 100 - customerSplit;
        await updateSocietyAction(society.id, {
          flatCount: Number(flatCount),
          rooftopSolarKw: Number(rooftopSolarKw),
          dailySurplusUnits: Number(dailySurplusUnits),
          netMeteringRate: Number(netMeteringRate),
          discomImportRate: Number(discomImportRate),
          revenueSplitCustomerPct: Number(customerSplit),
          revenueSplitCompanyPct: Number(companySplit),
          status,
          internalNotes,
        });
        setSuccess(true);
        router.refresh();
      } catch (err: any) {
        setError(err.message || "Failed to update society.");
      }
    });
  };

  const handleDelete = () => {
    const doubleCheck = confirm("WARNING: Deleting this society will erase all records, including associated energy logs and transactions. Proceed?");
    if (!doubleCheck) return;

    startTransition(async () => {
      try {
        await deleteSocietyAction(society.id);
        router.push("/admin");
      } catch (err: any) {
        setError(err.message || "Failed to delete society.");
      }
    });
  };

  return (
    <Card className="border border-slate-900 bg-card-dark shadow-xl">
      <CardHeader>
        <CardTitle className="text-base font-bold flex items-center gap-1.5 text-slate-100">
          <ShieldAlert className="h-5 w-5 text-accent" />
          Settings & Configurations (Admin Panel)
        </CardTitle>
        <CardDescription>
          Adjust parameters, edit internal developer logs, or delete the society profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate} className="space-y-6 text-xs">
          
          <div className="grid grid-cols-2 gap-4">
            
            {/* Flats Count */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1.5 uppercase">Flat Count</label>
              <Input
                type="number"
                value={flatCount}
                onChange={(e) => setFlatCount(e.target.value)}
                required
                className="bg-background/80"
                disabled={isPending}
              />
            </div>

            {/* Rooftop Solar Kw */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1.5 uppercase">Solar Capacity (kWp)</label>
              <Input
                type="number"
                step="0.1"
                value={rooftopSolarKw}
                onChange={(e) => setRooftopSolarKw(e.target.value)}
                required
                className="bg-background/80"
                disabled={isPending}
              />
            </div>

          </div>

          <div className="grid grid-cols-3 gap-4">
            
            {/* Daily Surplus Units */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1.5 uppercase text-[10px]">Daily Surplus (kWh)</label>
              <Input
                type="number"
                value={dailySurplusUnits}
                onChange={(e) => setDailySurplusUnits(e.target.value)}
                required
                className="bg-background/80"
                disabled={isPending}
              />
            </div>

            {/* Net Metering rate */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1.5 uppercase text-[10px]">Net-Meter Rate (₹)</label>
              <Input
                type="number"
                step="0.01"
                value={netMeteringRate}
                onChange={(e) => setNetMeteringRate(e.target.value)}
                required
                className="bg-background/80"
                disabled={isPending}
              />
            </div>

            {/* DISCOM Import rate */}
            <div>
              <label className="block text-muted-foreground font-semibold mb-1.5 uppercase text-[10px]">Import tariff (₹)</label>
              <Input
                type="number"
                step="0.01"
                value={discomImportRate}
                onChange={(e) => setDiscomImportRate(e.target.value)}
                required
                className="bg-background/80"
                disabled={isPending}
              />
            </div>

          </div>

          {/* Revenue Split slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-semibold">
              <span className="text-muted-foreground uppercase text-[10px]">Society Earning Split (%)</span>
              <span>{customerSplit}% (Company: {100 - customerSplit}%)</span>
            </div>
            <input
              type="range"
              min="30"
              max="80"
              value={customerSplit}
              onChange={(e) => setCustomerSplit(parseInt(e.target.value))}
              disabled={isPending}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="border-t border-emerald-950/20 my-4" />

          {/* Status Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-muted-foreground font-semibold uppercase">Operational Status</label>
            <Select
              defaultValue={status}
              onValueChange={(val) => setStatus(val as Status)}
              disabled={isPending}
            >
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="ONBOARDING" className="text-amber-400">ONBOARDING</SelectItem>
                <SelectItem value="ACTIVE" className="text-emerald-400">ACTIVE</SelectItem>
                <SelectItem value="PAUSED" className="text-rose-500">PAUSED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Internal Notes */}
          <div className="space-y-1.5">
            <label className="block text-muted-foreground font-semibold uppercase">Internal Developer Notes</label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Record developer logs, installation details, custom contracts notes..."
              rows={4}
              disabled={isPending}
              className="w-full bg-background/80 border border-input rounded-md px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-muted-foreground"
            />
          </div>

          {/* Feedback alerts */}
          {success && (
            <div className="flex items-center gap-2 p-3 text-xs bg-emerald-955 text-emerald-400 rounded-lg border border-emerald-500/20">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Society configuration details saved successfully.</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-destructive/15 text-destructive rounded-lg border border-destructive/20">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
            
            <Button
              type="button"
              onClick={handleDelete}
              variant="outline"
              disabled={isPending}
              className="border-rose-955 text-rose-500 hover:bg-rose-950/20 font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete Profile
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}
