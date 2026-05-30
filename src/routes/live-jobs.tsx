import { createFileRoute } from "@tanstack/react-router";
import { MapSkeleton } from "@/components/admin/PageSkeletons";
import { Radio, MapPin, Clock, DollarSign, Filter, Plus, X, Phone, MessageSquare, Navigation, Ban } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { MapPanel } from "@/components/admin/MapPanel";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/live-jobs")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<MapSkeleton />),
  head: () => ({ meta: [{ title: "Live Jobs — Nexora" }] }),
  component: LiveJobsPage,
});

type Job = {
  id: string;
  title: string;
  category: string;
  price: number;
  city: string;
  status: string;
  color: string;
  eta: string;
};

const initialJobs: Job[] = [
  { id: "J-2914", title: "Emergency plumbing repair",  category: "Plumbing",   price: 220, city: "Brooklyn, NY",  status: "Dispatched", color: "var(--color-cyan)",    eta: "12m" },
  { id: "J-2913", title: "Furniture moving · 2 movers", category: "Moving",     price: 480, city: "Austin, TX",    status: "In Progress", color: "var(--color-success)", eta: "1h 20m" },
  { id: "J-2912", title: "Deep house cleaning",         category: "Cleaning",   price: 160, city: "San Diego, CA", status: "Posted",      color: "var(--color-primary)", eta: "—" },
  { id: "J-2911", title: "TV mounting · 65 inch",       category: "Handyman",   price: 110, city: "Chicago, IL",   status: "Accepted",    color: "var(--color-cyan)",    eta: "32m" },
  { id: "J-2910", title: "Yard cleanup & hauling",      category: "Outdoor",    price: 290, city: "Denver, CO",    status: "Dispatched", color: "var(--color-cyan)",    eta: "8m" },
  { id: "J-2909", title: "AC unit installation",        category: "HVAC",       price: 640, city: "Phoenix, AZ",   status: "In Progress", color: "var(--color-success)", eta: "2h" },
  { id: "J-2908", title: "Electrical outlet repair",    category: "Electrical", price: 95,  city: "Seattle, WA",   status: "Posted",      color: "var(--color-primary)", eta: "—" },
  { id: "J-2907", title: "Catering staff · evening",    category: "Events",     price: 380, city: "Miami, FL",     status: "Accepted",    color: "var(--color-cyan)",    eta: "45m" },
];

const ALL_STATUSES = ["Posted", "Accepted", "Dispatched", "In Progress"] as const;

function LiveJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [viewId, setViewId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(ALL_STATUSES));
  const [search, setSearch] = useState("");
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", category: "", city: "", price: "" });
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const viewJob = jobs.find((j) => j.id === viewId) ?? null;

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (!statusFilter.has(j.status)) return false;
      if (search && !`${j.id} ${j.title} ${j.city} ${j.category}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [jobs, statusFilter, search]);

  const counts = useMemo(() => {
    const c = { Posted: 0, Accepted: 0, "In Progress": 0, Dispatched: 0 } as Record<string, number>;
    jobs.forEach((j) => { c[j.status] = (c[j.status] ?? 0) + 1; });
    return c;
  }, [jobs]);

  const toggleStatus = (s: string) => {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s); else next.add(s);
      return next;
    });
  };

  const handleAdvance = (id: string) => {
    setJobs((prev) => prev.map((j) => {
      if (j.id !== id) return j;
      const flow = ["Posted", "Accepted", "Dispatched", "In Progress"];
      const idx = flow.indexOf(j.status);
      const next = flow[Math.min(idx + 1, flow.length - 1)];
      const color = next === "In Progress" ? "var(--color-success)" : next === "Posted" ? "var(--color-primary)" : "var(--color-cyan)";
      return { ...j, status: next, color };
    }));
    toast.success("Job advanced to next stage");
  };

  const handleCreateDispatch = () => {
    if (!newJob.title || !newJob.city) {
      toast.error("Title and location are required");
      return;
    }
    const id = `J-${Math.floor(2900 + Math.random() * 99)}`;
    setJobs((prev) => [
      { id, title: newJob.title, category: newJob.category || "General", price: Number(newJob.price) || 0, city: newJob.city, status: "Dispatched", color: "var(--color-cyan)", eta: "—" },
      ...prev,
    ]);
    setNewJob({ title: "", category: "", city: "", price: "" });
    setDispatchOpen(false);
    toast.success(`Dispatched ${id}`);
  };

  const handleCancel = () => {
    if (!cancelId) return;
    setJobs((prev) => prev.filter((j) => j.id !== cancelId));
    toast.success(`Job ${cancelId} cancelled`, { description: cancelReason || undefined });
    setCancelId(null);
    setCancelReason("");
    setViewId(null);
  };

  return (
    <PageShell
      eyebrow="Real-time Marketplace"
      title="Live Jobs"
      description="Monitor every active job across regions with real-time dispatch status."
      actions={
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5 inline-flex items-center gap-1.5"><Filter className="h-3.5 w-3.5" /> Filters{statusFilter.size < ALL_STATUSES.length ? ` (${statusFilter.size})` : ""}</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {ALL_STATUSES.map((s) => (
                <DropdownMenuCheckboxItem key={s} checked={statusFilter.has(s)} onCheckedChange={() => toggleStatus(s)}>{s}</DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter(new Set(ALL_STATUSES))}>Reset filters</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={() => setDispatchOpen(true)} className="h-9 px-3 text-xs rounded-lg text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)" }}><Plus className="h-3.5 w-3.5" /> New Dispatch</button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Posted" value={String(counts.Posted ?? 0)} accent="var(--color-primary)" />
        <StatTile label="Accepted" value={String(counts.Accepted ?? 0)} accent="var(--color-cyan)" />
        <StatTile label="In Progress" value={String(counts["In Progress"] ?? 0)} accent="var(--color-success)" />
        <StatTile label="Dispatched" value={String(counts.Dispatched ?? 0)} accent="var(--color-warning)" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7"><MapPanel /></div>
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl glass gradient-border h-[460px] flex flex-col">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <span className="pulse-dot" />
              <h3 className="text-sm font-semibold text-white">Live job stream</h3>
              <span className="ml-auto text-[11px] text-white/40">{filtered.length} shown</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
              <ul className="space-y-1">
                {filtered.map((j) => (
                  <li
                    key={j.id}
                    onClick={() => setViewId(j.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter") setViewId(j.id); }}
                    className="rounded-xl p-3 hover:bg-white/[0.04] transition cursor-pointer outline-none focus:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] tabular-nums text-white/40 font-mono">{j.id}</span>
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded"
                            style={{ background: "oklch(1 0 0 / 0.05)", color: j.color }}>{j.status}</span>
                        </div>
                        <div className="text-sm text-white font-medium mt-1 truncate">{j.title}</div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-white/45">
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{j.city}</span>
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{j.eta}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-white tabular-nums">${j.price}</div>
                        <div className="text-[10px] text-white/40">{j.category}</div>
                      </div>
                    </div>
                  </li>
                ))}
                {filtered.length === 0 && (
                  <li className="text-center text-xs text-white/40 py-10">No jobs match the current filters.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl glass gradient-border overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <Radio className="h-4 w-4 text-[var(--color-cyan)]" />
          <h3 className="text-sm font-semibold text-white">All active jobs</h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs…"
            className="ml-auto h-8 px-3 text-xs rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/30 outline-none focus:border-white/20 w-56"
          />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-white/40">
              <th className="text-left font-medium px-5 py-3">Job</th>
              <th className="text-left font-medium px-5 py-3">Category</th>
              <th className="text-left font-medium px-5 py-3">Location</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="text-right font-medium px-5 py-3">ETA</th>
              <th className="text-right font-medium px-5 py-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j.id} onClick={() => setViewId(j.id)} className="border-t border-white/5 hover:bg-white/[0.025] cursor-pointer">
                <td className="px-5 py-3">
                  <div className="text-white font-medium">{j.title}</div>
                  <div className="text-[11px] text-white/40 font-mono">{j.id}</div>
                </td>
                <td className="px-5 py-3 text-white/70">{j.category}</td>
                <td className="px-5 py-3 text-white/70">{j.city}</td>
                <td className="px-5 py-3"><span className="text-[11px] px-2 py-0.5 rounded" style={{ background: "oklch(1 0 0 / 0.06)", color: j.color }}>{j.status}</span></td>
                <td className="px-5 py-3 text-right text-white/70 tabular-nums">{j.eta}</td>
                <td className="px-5 py-3 text-right text-white font-semibold tabular-nums"><span className="inline-flex items-center justify-end gap-1"><DollarSign className="h-3.5 w-3.5 text-white/40" />{j.price}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-xs text-white/40">No jobs match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Job detail sheet */}
      <Sheet open={!!viewJob} onOpenChange={(o) => !o && setViewId(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {viewJob && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: "oklch(1 0 0 / 0.06)", color: viewJob.color }}>{viewJob.status}</span>
                  <span className="text-[11px] font-mono text-white/40">{viewJob.id}</span>
                </div>
                <SheetTitle className="mt-2">{viewJob.title}</SheetTitle>
                <SheetDescription>{viewJob.category} · {viewJob.city}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-white/10 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/40">Price</div>
                    <div className="text-sm font-semibold text-white mt-1">${viewJob.price}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/40">ETA</div>
                    <div className="text-sm font-semibold text-white mt-1">{viewJob.eta}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/40">Category</div>
                    <div className="text-sm font-semibold text-white mt-1">{viewJob.category}</div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Timeline</div>
                  <ul className="space-y-2 text-xs text-white/70">
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" /> Posted by customer</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" /> Accepted by worker</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)]" /> Dispatched · arriving in {viewJob.eta}</li>
                    <li className="flex items-center gap-2 text-white/30"><span className="h-1.5 w-1.5 rounded-full bg-white/20" /> Completion pending</li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => toast.success("Calling worker…")} className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5 inline-flex items-center justify-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Call worker</button>
                  <button onClick={() => toast.success("Message sent to customer")} className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5 inline-flex items-center justify-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Message</button>
                  <button onClick={() => toast.success("Live tracking opened")} className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5 inline-flex items-center justify-center gap-1.5"><Navigation className="h-3.5 w-3.5" /> Track</button>
                  <button onClick={() => handleAdvance(viewJob.id)} className="h-9 px-3 text-xs rounded-lg text-white inline-flex items-center justify-center gap-1.5" style={{ background: "var(--gradient-primary)" }}>Advance stage</button>
                </div>

                <button onClick={() => setCancelId(viewJob.id)} className="w-full h-9 px-3 text-xs rounded-lg border border-[var(--color-danger)]/30 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 inline-flex items-center justify-center gap-1.5"><Ban className="h-3.5 w-3.5" /> Cancel job</button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* New dispatch dialog */}
      <Dialog open={dispatchOpen} onOpenChange={setDispatchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New dispatch</DialogTitle>
            <DialogDescription>Manually create and dispatch a job to nearby workers.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} placeholder="e.g. Emergency plumbing repair" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cat">Category</Label>
                <Input id="cat" value={newJob.category} onChange={(e) => setNewJob({ ...newJob, category: e.target.value })} placeholder="Plumbing" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" value={newJob.price} onChange={(e) => setNewJob({ ...newJob, price: e.target.value })} placeholder="220" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city">Location</Label>
              <Input id="city" value={newJob.city} onChange={(e) => setNewJob({ ...newJob, city: e.target.value })} placeholder="Brooklyn, NY" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDispatchOpen(false)} className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5">Cancel</button>
            <button onClick={handleCreateDispatch} className="h-9 px-3 text-xs rounded-lg text-white" style={{ background: "var(--gradient-primary)" }}>Dispatch</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel job dialog */}
      <Dialog open={!!cancelId} onOpenChange={(o) => { if (!o) { setCancelId(null); setCancelReason(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-2"><X className="h-4 w-4 text-[var(--color-danger)]" /> Cancel job {cancelId}</DialogTitle>
            <DialogDescription>This will remove the job from the live stream and notify the worker.</DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea id="reason" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="e.g. customer no longer needs service" />
          </div>
          <DialogFooter>
            <button onClick={() => { setCancelId(null); setCancelReason(""); }} className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5">Keep job</button>
            <button onClick={handleCancel} className="h-9 px-3 text-xs rounded-lg bg-[var(--color-danger)] text-white">Confirm cancellation</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
