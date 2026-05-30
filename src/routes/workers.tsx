import { createFileRoute } from "@tanstack/react-router";
import { CardGridSkeleton } from "@/components/admin/PageSkeletons";
import { Star, MapPin, BadgeCheck, Briefcase, Send, Phone, Mail, Shield, Clock } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/workers")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<CardGridSkeleton {...{ eyebrow: "Workforce", count: 9 }} />),
  head: () => ({ meta: [{ title: "Workers — Nexora" }] }),
  component: WorkersPage,
});

type Worker = {
  name: string; skill: string; rating: number; jobs: number; city: string;
  earn: number; online: boolean; verified: boolean;
  email?: string; phone?: string; joined?: string; completion?: number;
};

const workers: Worker[] = [
  { name: "Marcus Thompson",  skill: "Plumbing",   rating: 4.9, jobs: 312, city: "Brooklyn, NY",  earn: 18420, online: true,  verified: true,  email: "marcus.t@nexora.app",  phone: "+1 (347) 555-0142", joined: "Mar 2022", completion: 98 },
  { name: "Sofia Lin",         skill: "Cleaning",   rating: 4.8, jobs: 248, city: "San Jose, CA",  earn: 12810, online: true,  verified: true,  email: "sofia.lin@nexora.app", phone: "+1 (408) 555-0193", joined: "Jul 2022", completion: 96 },
  { name: "Carlos Rivera",     skill: "Moving",     rating: 4.7, jobs: 184, city: "Miami, FL",     earn: 22400, online: false, verified: true,  email: "carlos.r@nexora.app",  phone: "+1 (305) 555-0167", joined: "Jan 2023", completion: 94 },
  { name: "Aisha Khan",        skill: "Cooking",    rating: 5.0, jobs: 96,  city: "Houston, TX",   earn: 7820,  online: true,  verified: true,  email: "aisha.k@nexora.app",   phone: "+1 (713) 555-0124", joined: "Sep 2023", completion: 100 },
  { name: "Daniel Park",       skill: "Electrical", rating: 4.6, jobs: 421, city: "Seattle, WA",   earn: 31500, online: false, verified: true,  email: "daniel.p@nexora.app",  phone: "+1 (206) 555-0178", joined: "May 2021", completion: 92 },
  { name: "Helena Novak",      skill: "Tutoring",   rating: 4.9, jobs: 73,  city: "Prague, CZ",    earn: 4280,  online: true,  verified: false, email: "helena.n@nexora.app", phone: "+420 555 0184",     joined: "Feb 2024", completion: 97 },
];

function WorkersPage() {
  const [viewWorker, setViewWorker] = useState<Worker | null>(null);
  const [msgWorker, setMsgWorker] = useState<Worker | null>(null);
  const [msg, setMsg] = useState("");

  const sendMessage = () => {
    if (!msg.trim()) { toast.error("Message can't be empty"); return; }
    toast.success(`Message sent to ${msgWorker?.name}`);
    setMsg("");
    setMsgWorker(null);
  };

  return (
    <PageShell
      eyebrow="Workforce"
      title="Workers"
      description="The talent powering the marketplace. Filter, verify, and monitor performance."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Active Workers" value="18,420" accent="var(--color-cyan)" />
        <StatTile label="Online now" value="6,128" accent="var(--color-success)" />
        <StatTile label="Avg rating" value="4.82 ★" accent="var(--color-warning)" />
        <StatTile label="Top earner / mo" value="$12,480" accent="var(--color-primary)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {workers.map((w) => (
          <div key={w.name} className="rounded-2xl glass gradient-border p-5 hover-lift">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-white font-semibold">
                  {w.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-[oklch(0.20_0.04_265)] ${w.online ? "bg-[var(--color-success)]" : "bg-white/20"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-white truncate">{w.name}</span>
                  {w.verified && <BadgeCheck className="h-3.5 w-3.5 text-[var(--color-cyan)]" />}
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">{w.skill}</div>
                <div className="text-[11px] text-white/45 mt-1 inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{w.city}</div>
              </div>
              <div className="inline-flex items-center gap-1 text-xs text-white/80">
                <Star className="h-3.5 w-3.5 text-[var(--color-warning)] fill-[var(--color-warning)]" />{w.rating}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-white/40">Jobs</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-0.5 inline-flex items-center gap-1"><Briefcase className="h-3 w-3 text-white/40" />{w.jobs}</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-white/40">Earnings</div>
                <div className="text-sm font-semibold text-white tabular-nums mt-0.5">${w.earn.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setViewWorker(w)}
                className="flex-1 h-8 text-xs rounded-lg text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                View
              </button>
              <button
                onClick={() => setMsgWorker(w)}
                className="flex-1 h-8 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5"
              >
                Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Profile Sheet */}
      <Sheet open={!!viewWorker} onOpenChange={(o) => !o && setViewWorker(null)}>
        <SheetContent className="bg-[oklch(0.18_0.04_265)] border-white/10 text-white sm:max-w-md overflow-y-auto">
          {viewWorker && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-white font-semibold text-lg">
                      {viewWorker.name.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-[oklch(0.18_0.04_265)] ${viewWorker.online ? "bg-[var(--color-success)]" : "bg-white/20"}`} />
                  </div>
                  <div>
                    <SheetTitle className="text-white flex items-center gap-1.5">
                      {viewWorker.name}
                      {viewWorker.verified && <BadgeCheck className="h-4 w-4 text-[var(--color-cyan)]" />}
                    </SheetTitle>
                    <SheetDescription className="text-white/55">
                      {viewWorker.skill} · {viewWorker.city}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Stat label="Rating" value={`${viewWorker.rating} ★`} />
                  <Stat label="Jobs done" value={String(viewWorker.jobs)} />
                  <Stat label="Lifetime earn" value={`$${viewWorker.earn.toLocaleString()}`} />
                  <Stat label="Completion" value={`${viewWorker.completion ?? 95}%`} />
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3 space-y-2 text-sm">
                  <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={viewWorker.email ?? "—"} />
                  <Row icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={viewWorker.phone ?? "—"} />
                  <Row icon={<Clock className="h-3.5 w-3.5" />} label="Joined" value={viewWorker.joined ?? "—"} />
                  <Row icon={<Shield className="h-3.5 w-3.5" />} label="KYC" value={viewWorker.verified ? "Verified" : "Pending"} />
                  <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={viewWorker.city} />
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
                  <div className="text-[11px] uppercase tracking-wider text-white/40 mb-2">Recent activity</div>
                  <ul className="text-xs text-white/70 space-y-1.5">
                    <li>· Completed job #JB-{2400 + viewWorker.jobs} · 2h ago</li>
                    <li>· Received 5★ review from a client · yesterday</li>
                    <li>· Payout of $420 processed · 3 days ago</li>
                  </ul>
                </div>
              </div>

              <SheetFooter className="mt-6 flex-col sm:flex-row gap-2">
                <Button
                  className="flex-1 text-white"
                  style={{ background: "var(--gradient-primary)" }}
                  onClick={() => { setMsgWorker(viewWorker); setViewWorker(null); }}
                >
                  <Send className="h-3.5 w-3.5" /> Send message
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5"
                  onClick={() => { toast.success(`${viewWorker.name}'s payouts opened`); setViewWorker(null); }}
                >
                  View payouts
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Message Dialog */}
      <Dialog open={!!msgWorker} onOpenChange={(o) => { if (!o) { setMsgWorker(null); setMsg(""); } }}>
        <DialogContent className="bg-[oklch(0.18_0.04_265)] border-white/10 text-white">
          {msgWorker && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">Message {msgWorker.name}</DialogTitle>
                <DialogDescription className="text-white/55">
                  Sent via Nexora in-app chat · {msgWorker.online ? "Online now" : "Offline"}
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder={`Hi ${msgWorker.name.split(" ")[0]}, …`}
                rows={5}
                className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30"
              />
              <DialogFooter>
                <Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5" onClick={() => setMsgWorker(null)}>
                  Cancel
                </Button>
                <Button className="text-white" style={{ background: "var(--gradient-primary)" }} onClick={sendMessage}>
                  <Send className="h-3.5 w-3.5" /> Send
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
