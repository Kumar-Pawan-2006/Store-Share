import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { LeadForm } from "@/components/lead-form";
import { 
  ArrowRight, ShieldCheck, Sun, Zap, CheckCircle2, 
  Activity, BadgePercent, Wrench, IndianRupee, Globe
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbOffline = !process.env.DATABASE_URL;

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-accent selection:text-accent-foreground">
      {/* Dynamic Navbar */}
      <Navbar dbOffline={dbOffline} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-emerald-950/30 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),rgba(255,255,255,0))]">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f2a24_1px,transparent_1px),linear-gradient(to_bottom,#0f2a24_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/40 text-emerald-300 border border-emerald-500/20 mb-6">
            <Globe className="h-3 w-3 text-accent animate-spin-slow" />
            <span>Empowering housing societies in Patna, Nagpur, and Delhi</span>
          </div>

          {/* Hinglish Hero Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight md:leading-[1.1] mb-6">
            Battery <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">mat kharido</span>, apni excess solar surplus humein do, hum aapko denge <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">extra monthly profits</span> — seedha.
          </h1>

          {/* Hinglish Pitch Paragraph */}
          <p className="text-lg md:text-xl text-emerald-100/70 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Pehle jo micro-returns milte the, ab usse <span className="text-slate-100 font-semibold underline decoration-accent decoration-2">zyada milega</span> — bina battery buying cost, bina server maintenance complications. Store & Share manages the hardware, sharing clean arbitrage earnings instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculator">
              <span className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-primary hover:bg-primary-hover text-primary-foreground font-bold shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer">
                Unlock Savings ROI
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
            <a href="#leads">
              <span className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer bg-slate-900/50">
                Explore B2B Partnership
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* 4-Step Animated Flowchart */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How it Works: Step-by-Step Flow</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From empty spaces to generating actual cash splits. Here is the operational loop:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/3 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-emerald-800 to-amber-600/40 -z-10" />

          {/* Step 1 */}
          <div className="bg-card-dark rounded-xl p-6 border border-emerald-950/20 relative shadow-inner">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold mb-4 border border-zinc-700">
              01
            </div>
            <h3 className="font-bold text-lg mb-2 text-emerald-300">Idle Solar Generation</h3>
            <p className="text-sm text-muted-foreground">
              Your society generates excess solar electricity during midday. Without storage, DISCOMs buy it back at highly cheap net-metering rates (approx ₹2/kWh).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-card-dark rounded-xl p-6 border border-emerald-950/20 relative shadow-inner">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold mb-4 border border-zinc-700">
              02
            </div>
            <h3 className="font-bold text-lg mb-2 text-primary-foreground">Smart Battery Fitted</h3>
            <p className="text-sm text-muted-foreground">
              Store & Share installs an industrial-grade battery unit at your society grounds. Zero upfront capital expenditure or maintenance costs for the society.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-card-dark rounded-xl p-6 border border-emerald-950/30 relative shadow-inner">
            <div className="h-10 w-10 rounded-lg bg-emerald-950 text-accent flex items-center justify-center font-bold mb-4 border border-accent/20">
              03
            </div>
            <h3 className="font-bold text-lg mb-2 text-accent">Charge & Peak Offset</h3>
            <p className="text-sm text-muted-foreground">
              Our AI charger absorbs daylight solar, discharging it during evening grid peaks to offset expensive DISCOM import rates (e.g. ₹8.5/kWh), creating arbitrage.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-card-dark rounded-xl p-6 border border-emerald-950/30 relative shadow-inner">
            <div className="h-10 w-10 rounded-lg bg-emerald-900 text-accent flex items-center justify-center font-bold mb-4 border border-accent/20">
              04
            </div>
            <h3 className="font-bold text-lg mb-2 text-emerald-400">Monthly Revenue Share</h3>
            <p className="text-sm text-muted-foreground">
              The gross value delta (₹6.50 profit margin) is calculated monthly. The society pockets a guaranteed 60% split, while Store & Share retains a 40% operating share.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Regulations Section */}
      <section className="py-16 bg-emerald-950/15 border-y border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8">
              <div className="inline-flex items-center space-x-2 text-accent text-xs font-semibold mb-2 tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>100% REGULATORY SAFE & DISCOM COMPLIANT</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Why Store & Share is Compliant with Indian Regulations</h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                India has strict rules regarding the sale and transmission of electricity. <strong className="text-slate-100">We never buy, sell, or trade electricity</strong> directly between individual consumers or buildings. 
                We operate strictly as a storage and optimization service. The actual physical power remains anchored and flows within the DISCOM's authorized grid lines. 
                Because no distribution license or grid bypass is utilized, housing societies remain regulatory safe.
              </p>
            </div>
            <div className="md:col-span-4 bg-emerald-950/40 p-6 rounded-xl border border-emerald-900/40">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm">Zero power wheeling fees incurred</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm">No distribution or trading license required</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm">Fully compatible with regional state net-metering laws</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Revenue Streams Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Store & Share Triple-Stream Revenue Model</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ensuring high-margin scalability through asset capitalization, technology licensing, and services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stream 1 */}
          <div className="bg-card-dark p-8 rounded-2xl border border-emerald-950/40 relative group hover:border-emerald-700/50 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-emerald-900/30 text-emerald-400 flex items-center justify-center mb-6">
              <IndianRupee className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-100">01. On-Premises revenue Share</h3>
            <p className="text-sm text-emerald-100/60 leading-relaxed mb-4">
              Direct generation profit slice: Store & Share pockets 40% of the energy value delta computed from hourly utility offsets at every battery installation.
            </p>
            <span className="text-xs font-semibold text-accent tracking-widest uppercase">
              Operational Stream
            </span>
          </div>

          {/* Stream 2 */}
          <div className="bg-card-dark p-8 rounded-2xl border border-emerald-950/40 relative group hover:border-emerald-700/50 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-emerald-900/30 text-emerald-400 flex items-center justify-center mb-6">
              <Activity className="h-6 w-6 text-emerald-300" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-100">02. SaaS Optimize Software</h3>
            <p className="text-sm text-emerald-100/60 leading-relaxed mb-4">
              Licensing our smart cloud telemetry and battery management algorithm to third-party developers, grid managers, and solar installers.
            </p>
            <span className="text-xs font-semibold text-emerald-300 tracking-widest uppercase">
              Technology Stream
            </span>
          </div>

          {/* Stream 3 */}
          <div className="bg-card-dark p-8 rounded-2xl border border-emerald-950/40 relative group hover:border-emerald-700/50 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-emerald-900/30 text-emerald-400 flex items-center justify-center mb-6">
              <Wrench className="h-6 w-6 text-emerald-300" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-100">03. Annual Maintenance AMC</h3>
            <p className="text-sm text-emerald-100/60 leading-relaxed mb-4">
              Fixed recurring service contracts with large developers to run remote monitoring, health checks, cell repairs, and capacity extensions.
            </p>
            <span className="text-xs font-semibold text-emerald-300 tracking-widest uppercase">
              Services Stream
            </span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-12">Trusted by Society Presidents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-950/70 p-6 rounded-xl border border-emerald-950/20 shadow-lg">
              <p className="text-slate-300 text-sm italic mb-6">
                "Our common area maintenance bill was ₹45,000 per month. With Store & Share deploying the battery charging loop, we cut it by ₹18,000 without spending a single Rupee of society corpus. Great Hinglish customer support!"
              </p>
              <div>
                <h4 className="font-semibold text-emerald-400">Vijay Deshmukh</h4>
                <p className="text-xs text-muted-foreground">President, Ganga Heights CHS - Nagpur</p>
              </div>
            </div>

            <div className="bg-slate-950/70 p-6 rounded-xl border border-emerald-950/20 shadow-lg">
              <p className="text-slate-300 text-sm italic mb-6">
                "Initially, we were skeptical about regulatory issues. Setting this up at our housing complex was completely painless. Now we get a direct credit of around ₹22,000 every month on dynamic dashboard splits."
              </p>
              <div>
                <h4 className="font-semibold text-emerald-400">Sanjay Sinha</h4>
                <p className="text-xs text-muted-foreground">Secretary, Pataliputra Greens - Patna</p>
              </div>
            </div>

            <div className="bg-slate-950/70 p-6 rounded-xl border border-emerald-950/20 shadow-lg">
              <p className="text-slate-300 text-sm italic mb-6">
                "We were exporting at ₹2.5/kWh net metering. With storage, the peak-offset gives us ₹9.5/kWh. 60% of that margin returns directly to us. Absolute no-brainer for Dwarka flat owners!"
              </p>
              <div>
                <h4 className="font-semibold text-emerald-400">Aman Verma</h4>
                <p className="text-xs text-muted-foreground">Manager, Dwarka Greens - Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRM B2B Lead Form Section */}
      <section id="leads" className="py-20 border-t border-emerald-950/20 max-w-4xl mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Partner with Store & Share</h2>
          <p className="text-muted-foreground">
            Are you a solar developer, battery operator, or society representative? Connect with us to explore scaling contracts.
          </p>
        </div>
        <LeadForm />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 py-8 text-center text-xs text-muted-foreground px-4">
        <p>© 2026 Store & Share Platform. All Rights Reserved. Built for Indian Housing Societies.</p>
        <p className="mt-2 text-emerald-700/60">Nagpur • Patna • Delhi</p>
      </footer>
    </div>
  );
}
