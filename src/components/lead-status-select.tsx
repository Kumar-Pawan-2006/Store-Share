"use client";

import React, { useTransition } from "react";
import { updateB2BLeadStatus } from "@/lib/actions/db-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadStatus } from "@prisma/client";

export function LeadStatusSelect({ leadId, currentStatus }: { leadId: string; currentStatus: LeadStatus }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (val: string) => {
    startTransition(async () => {
      try {
        await updateB2BLeadStatus(leadId, val as LeadStatus);
      } catch (err) {
        alert("Failed to update status. Database error.");
      }
    });
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-32 h-8 bg-zinc-950/60 border-zinc-800 text-[11px] font-semibold text-slate-300">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent className="bg-slate-900 border-slate-800 text-[11px]">
        <SelectItem value="NEW" className="text-amber-400">NEW</SelectItem>
        <SelectItem value="CONTACTED" className="text-sky-400">CONTACTED</SelectItem>
        <SelectItem value="CONVERTED" className="text-emerald-400">CONVERTED</SelectItem>
        <SelectItem value="LOST" className="text-slate-400">LOST</SelectItem>
      </SelectContent>
    </Select>
  );
}
