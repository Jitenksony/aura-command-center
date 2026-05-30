import { createFileRoute, Link } from "@tanstack/react-router";
import { CardGridSkeleton } from "@/components/admin/PageSkeletons";
import { Building2, MapPin, TrendingUp, Mail, Phone, Clock, Shield, AlertTriangle, Ban, Eye, Wallet, Users, FileText } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/businesses")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<CardGridSkeleton {...{ eyebrow: "Demand", count: 9 }} />),
  head: () => ({ meta: [{ title: "Businesses — Nexora" }] }),
  component: BusinessesPage,
});

export type Business = {
  name: string; industry: string; plan: string; spend: number; jobs: number; city: string; health: number;
  email?: string; phone?: string; joined?: string; contacts?: number; contracts?: number; suspended?: boolean;
  suspendReason?: string;
};

export const slugify = (n: string) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const biz: Business[] = [
  { name: "TaskMate Inc.",      industry: "Logistics",   plan: "Enterprise", spend: 124800, jobs: 1820, city: "New York, NY",  health: 92, email: "ops@taskmate.io",       phone: "+1 (212) 555-0101", joined: "Jan 2020", contacts: 14, contracts: 48 },
  { name: "Northwind Catering", industry: "Hospitality", plan: "Pro",        spend: 48200,  jobs: 612,  city: "Chicago, IL",   health: 78, email: "hello@northwind.com",   phone: "+1 (312) 555-0192", joined: "Mar 2021", contacts: 6,  contracts: 12 },
  { name: "Iris Holdings",      industry: "Real Estate", plan: "Enterprise", spend: 218400, jobs: 2480, city: "Miami, FL",     health: 96, email: "mgmt@irisholdings.net", phone: "+1 (305) 555-0177", joined: "Jun 2019", contacts: 22, contracts: 64 },
  { name: "Verdant Cleanup",    industry: "Cleaning",    plan: "Growth",     spend: 18400,  jobs: 184,  city: "Portland, OR",  health: 64, email: "support@verdant.co",    phone: "+1 (503) 555-0134", joined: "Nov 2022", contacts: 3,  contracts: 8  },
  { name: "Helix Events",       industry: "Events",      plan: "Pro",        spend: 36400,  jobs: 312,  city: "Austin, TX",    health: 81, email: "bookings@helixevents.tv", phone: "+1 (512) 555-0165", joined: "Aug 2020", contacts: 8,  contracts: 22 },
  { name: "Stratus Movers",     industry: "Moving",      plan: "Growth",     spend: 22800,  jobs: 244,  city: "Denver, CO",    health: 73, email: "move@stratus.net",      phone: "+1 (720) 555-0188", joined: "Feb 2021", contacts: 5,  contracts: 14 },
];

function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>(biz);
  const [viewBiz, setViewBiz] = useState<Business | null>(null);
  const [suspendBiz, setSuspendBiz] = useState<Business | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  const handleSuspend = () => {
    if (!suspendReason.trim()) { toast.error("Please enter a reason for suspension"); return; }
    setBusinesses((prev) =>
      prev.map((b) =>
        b.name === suspendBiz?.name ? { ...b, suspended: true, suspendReason } : b
      )
    );
    toast.error(`${suspendBiz?.name} has been suspended`, {
      description: `Reason: ${suspendReason}`,
    });
    setSuspendReason("");
    setSuspendBiz(null);
  };

  const handleReinstate = (b: Business) => {
    setBusinesses((prev) =>
      prev.map((x) => (x.name === b.name ? { ...x, suspended: false, suspendReason: undefined } : x))
    );
    toast.success(`${b.name} has been reinstated`);
  };

  return (
    <PageShell eyebrow="Demand" title="Businesses" description="Enterprise customers and SMB demand across the platform.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Total Businesses" value="5,612" accent="var(--color-cyan)" />
        <StatTile label="Enterprise" value="148" accent="var(--color-primary)" />
        <StatTile label="Monthly GMV" value="$2.84M" accent="var(--color-success)" />
        <StatTile label="Net retention" value="118%" accent="var(--color-warning)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {businesses.map((b) => (
          <div key={b.name} className={`rounded-2xl glass gradient-border p-5 hover-lift ${b.suspended ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="grid place-items-center h-11 w-11 rounded-xl"
                  style={{ background: "linear-gradient(135deg, oklch(0.62 0.21 275 / 0.25), oklch(0.74 0.15 210 / 0.15))", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                    {b.name}
                    {b.suspended && <Ban className="h-3.5 w-3.5 text-red-400" />}
                  </div>
                  <div className="text-[11px] text-white/50">{b.industry}</div>
                  <div className="text-[11px] text-white/45 mt-0.5 inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{b.city}</div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md text-white/80" style={{ background: "oklch(1 0 0 / 0.06)" }}>{b.plan}</span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] text-white/55"><span>Account health</span><span className="text-white tabular-nums">{b.health}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${b.health}%`, background: b.health > 85 ? "var(--color-success)" : b.health > 70 ? "var(--color-cyan)" : "var(--color-warning)" }} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-white/40">Spend</div>
                <div className="text-sm font-semibold text-white tabular-nums">${b.spend.toLocaleString()}</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-white/40">Jobs</div>
                <div className="text-sm font-semibold text-white tabular-nums inline-flex items-center gap-1"><TrendingUp className="h-3 w-3 text-[var(--color-success)]" />{b.jobs}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                className="flex-1 h-8 text-xs text-white"
                style={{ background: "var(--gradient-primary)" }}
                onClick={() => setViewBiz(b)}
              >
                <Eye className="h-3.5 w-3.5 mr-1" /> View Profile
              </Button>
              {b.suspended ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs border-white/10 bg-transparent text-white hover:bg-white/5"
                  onClick={() => handleReinstate(b)}
                >
                  <Shield className="h-3.5 w-3.5 mr-1" /> Reinstate
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-8 text-xs border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200"
                  onClick={() => setSuspendBiz(b)}
                >
                  <Ban className="h-3.5 w-3.5 mr-1" /> Suspend Account
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View Profile Sheet */}
      <Sheet open={!!viewBiz} onOpenChange={(o) => !o && setViewBiz(null)}>
        <SheetContent className="bg-[oklch(0.18_0.04_265)] border-white/10 text-white sm:max-w-md overflow-y-auto">
          {viewBiz && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="grid place-items-center h-14 w-14 rounded-xl"
                    style={{ background: "linear-gradient(135deg, oklch(0.62 0.21 275 / 0.25), oklch(0.74 0.15 210 / 0.15))", border: "1px solid oklch(1 0 0 / 0.08)" }}>
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-white flex items-center gap-1.5">
                      {viewBiz.name}
                      {viewBiz.suspended && <Ban className="h-4 w-4 text-red-400" />}
                    </SheetTitle>
                    <SheetDescription className="text-white/55">
                      {viewBiz.industry} · {viewBiz.city}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Stat label="Account health" value={`${viewBiz.health}%`} />
                  <Stat label="Plan" value={viewBiz.plan} />
                  <Stat label="Lifetime spend" value={`$${viewBiz.spend.toLocaleString()}`} />
                  <Stat label="Jobs posted" value={String(viewBiz.jobs)} />
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3 space-y-2 text-sm">
                  <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={viewBiz.email ?? "—"} />
                  <Row icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={viewBiz.phone ?? "—"} />
                  <Row icon={<Clock className="h-3.5 w-3.5" />} label="Joined" value={viewBiz.joined ?? "—"} />
                  <Row icon={<Users className="h-3.5 w-3.5" />} label="Contacts" value={String(viewBiz.contacts ?? 0)} />
                  <Row icon={<FileText className="h-3.5 w-3.5" />} label="Active contracts" value={String(viewBiz.contracts ?? 0)} />
                  <Row icon={<Shield className="h-3.5 w-3.5" />} label="Status" value={viewBiz.suspended ? `Suspended · ${viewBiz.suspendReason}` : "Active"} />
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                  <div className="text-[11px] uppercase tracking-wider text-white/40 mb-2">Recent activity</div>
                  <ul className="text-xs text-white/70 space-y-1.5">
                    <li>· Posted job #{2400 + viewBiz.jobs} · 2h ago</li>
                    <li>· Paid invoice for $4,200 · yesterday</li>
                    <li>· Onboarded 3 new team members · 3 days ago</li>
                  </ul>
                </div>
              </div>

              <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
                {viewBiz.suspended ? (
                  <Button
                    className="flex-1 text-white"
                    style={{ background: "var(--gradient-primary)" }}
                    onClick={() => { handleReinstate(viewBiz); setViewBiz(null); }}
                  >
                    <Shield className="h-3.5 w-3.5 mr-1" /> Reinstate Account
                  </Button>
                ) : (
                  <Button
                    className="flex-1 text-white"
                    style={{ background: "var(--gradient-primary)" }}
                    onClick={() => { setSuspendBiz(viewBiz); setViewBiz(null); }}
                  >
                    <Ban className="h-3.5 w-3.5 mr-1" /> Suspend Account
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5"
                  onClick={() => { toast.success(`${viewBiz.name} payouts opened`); setViewBiz(null); }}
                >
                  <Wallet className="h-3.5 w-3.5 mr-1" /> View payouts
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Suspend Dialog */}
      <Dialog open={!!suspendBiz} onOpenChange={(o) => { if (!o) { setSuspendBiz(null); setSuspendReason(""); } }}>
        <DialogContent className="bg-[oklch(0.18_0.04_265)] border-white/10 text-white">
          {suspendBiz && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Suspend {suspendBiz.name}
                </DialogTitle>
                <DialogDescription className="text-white/55">
                  This account will be immediately suspended and the business will lose platform access. Provide a reason below.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Reason for suspension (e.g., illegal activity, fraud, terms violation)..."
                rows={4}
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30"
              />
              <DialogFooter>
                <Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5" onClick={() => setSuspendBiz(null)}>
                  Cancel
                </Button>
                <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleSuspend}>
                  <Ban className="h-3.5 w-3.5 mr-1" /> Confirm Suspension
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="text-sm font-semibold text-white tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-1.5 text-white/50 text-xs">{icon}{label}</span>
      <span className="text-white/85 text-xs truncate">{value}</span>
    </div>
  );
}
