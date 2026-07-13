"use client";

import React, { useState, useTransition } from "react";
import { createB2BLead } from "@/lib/actions/db-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export function LeadForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get("companyName") as string;
    const contactEmail = formData.get("contactEmail") as string;
    const interestType = formData.get("interestType") as string;
    const notes = formData.get("notes") as string;

    if (!companyName || !contactEmail || !interestType) {
      setError("Please fill out all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createB2BLead({
          companyName,
          contactEmail,
          interestType,
          notes,
        });

        if (res.success) {
          setSuccess(true);
        }
      } catch (err: any) {
        setError(err.message || "Failed to submit lead. Please try again.");
      }
    });
  };

  if (success) {
    return (
      <Card className="border border-emerald-500/30 bg-emerald-950/20 text-center py-6">
        <CardContent className="pt-6 flex flex-col items-center">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
          <h3 className="text-xl font-semibold mb-2">Lead Registered Successfully!</h3>
          <p className="text-muted-foreground text-sm max-w-sm mb-4">
            Thank you for your interest. An energy optimization specialist from Store & Share will reach out raw to your team within 24 hours.
          </p>
          <Button onClick={() => setSuccess(false)} variant="outline" size="sm">
            Submit Another Query
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/20 bg-card/65 backdrop-blur shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl" />
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          Contact our B2B Team
        </CardTitle>
        <CardDescription>
          Explore software licensing, battery leasing partnerships, or maintenance solutions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              COMPANY NAME *
            </label>
            <Input
              name="companyName"
              placeholder="e.g. Adani Solar East"
              required
              className="bg-background/80"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              EMAIL ADDRESS *
            </label>
            <Input
              name="contactEmail"
              type="email"
              placeholder="partner@yourcompany.com"
              required
              className="bg-background/80"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              INTEREST TYPE *
            </label>
            <Select name="interestType" required defaultValue="SOFTWARE_LICENSE" disabled={isPending}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOFTWARE_LICENSE">AI Software Licensing</SelectItem>
                <SelectItem value="PARTNERSHIP">Joint Portfolio Partnership</SelectItem>
                <SelectItem value="AMC">AMC & Maintenance Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              BRIEF REQUIREMENT / NOTES
            </label>
            <Input
              name="notes"
              placeholder="Brief details about your housing project or energy portfolio..."
              className="bg-background/80"
              disabled={isPending}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-destructive/15 text-destructive rounded-lg border border-destructive/20 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? "Submitting Request..." : "Send Request"}
            {!isPending && <Send className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
