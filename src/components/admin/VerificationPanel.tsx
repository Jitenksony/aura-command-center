import { useMemo, useState } from "react";
import { Check, X, RotateCw, ShieldX, BadgeCheck, ScanFace, FileImage, Search } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Status = "pending" | "review" | "risk" | "approved" | "rejected" | "suspended" | "reupload";

type Candidate = {
  id: string;
  name: string;
  role: string;
  score: number;
  status: Status;
  faceMatch: number;
  liveness: number;
  docQuality: number;
  fraudRisk: number;
};

const SEED: Candidate[] = [
  { id: "v-001", name: "Sofia Martinez", role: "Plumber · NYC",       score: 96, status: "pending", faceMatch: 97, liveness: 94, docQuality: 88, fraudRisk: 6 },
  { id: "v-002", name: "Kenji Watanabe", role: "Mover · Austin",      score: 89, status: "review",  faceMatch: 91, liveness: 88, docQuality: 82, fraudRisk: 12 },
  { id: "v-003", name: "Amara Okonkwo",  role: "Cleaner · Lagos",     score: 42, status: "risk",    faceMatch: 58, liveness: 49, docQuality: 71, fraudRisk: 74 },
  { id: "v-004", name: "Diego Alvarez",  role: "Electrician · Miami", score: 91, status: "pending", faceMatch: 93, liveness: 90, docQuality: 85, fraudRisk: 9  },
  { id: "v-005", name: "Priya Nair",     role: "Tutor · Mumbai",      score: 87, status: "review",  faceMatch: 89, liveness: 86, docQuality: 80, fraudRisk: 14 },
  { id: "v-006", name: "Lucas Becker",   role: "Mover · Berlin",      score: 78, status: "pending", faceMatch: 82, liveness: 76, docQuality: 79, fraudRisk: 18 },
];

const STATUS_STYLE: Record<Status, { bg: string; fg: string; label: string }> = {
  pending:   { bg: "oklch(0.82 0.17 85 / 0.15)",  fg: "var(--color-warning)", label: "Pending"   },
  review:    { bg: "oklch(0.78 0.15 220 / 0.15)", fg: "var(--color-cyan)",    label: "In Review" },
  risk:      { bg: "oklch(0.65 0.23 27 / 0.15)",  fg: "var(--color-danger)",  label: "High Risk" },
  approved:  { bg: "oklch(0.74 0.18 150 / 0.15)", fg: "var(--color-success)", label: "Approved"  },
  rejected:  { bg: "oklch(0.65 0.23 27 / 0.15)",  fg: "var(--color-danger)",  label: "Rejected"  },
  suspended: { bg: "oklch(0.55 0.04 265 / 0.20)", fg: "oklch(0.85 0.02 265)", label: "Suspended" },
  reupload:  { bg: "oklch(0.78 0.15 220 / 0.15)", fg: "var(--color-cyan)",    label: "Re-upload" },
};

export function VerificationPanel() {
  const [items, setItems] = useState<Candidate[]>(SEED);
  const [selectedId, setSelectedId] = useState<string>(SEED[0].id);
  const [queueOpen, setQueueOpen] = useState(false);
  const [queueQuery, setQueueQuery] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const selected = items.find((i) => i.id === selectedId) ?? items[0];
  const queueLeft = items.filter((i) => ["pending", "review", "risk", "reupload"].includes(i.status));

  const update = (id: string, patch: Partial<Candidate>) =>
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const advance = (currentId: string) => {
    const next = queueLeft.find((c) => c.id !== currentId);
    if (next) setSelectedId(next.id);
  };

  const approve = () => {
    update(selected.id, { status: "approved" });
    toast.success(`${selected.name} approved`, { description: "Worker is now verified on the platform." });
    advance(selected.id);
  };
  const reupload = () => {
    update(selected.id, { status: "reupload" });
    toast.message(`Re-upload requested`, { description: `${selected.name} will be notified to resubmit documents.` });
  };
  const suspend = () => {
    update(selected.id, { status: "suspended" });
    toast.warning(`${selected.name} suspended`, { description: "Worker access is paused pending review." });
    advance(selected.id);
  };
  const confirmReject = () => {
    if (!rejectReason.trim()) { toast.error("Add a reason before rejecting"); return; }
    update(selected.id, { status: "rejected" });
    toast.error(`${selected.name} rejected`, { description: rejectReason });
    setRejectOpen(false);
    setRejectReason("");
    advance(selected.id);
  };

  const filteredQueue = useMemo(() => {
    const q = queueQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
  }, [items, queueQuery]);

  const initials = (n: string) => n.split(" ").map((s) => s[0]).join("");
  const s = STATUS_STYLE[selected.status];

  return (
    <div className="rounded-2xl glass gradient-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScanFace className="h-4 w-4 text-[var(--color-primary)]" />
          <h3 className="text-sm font-semibold text-white tracking-tight">Worker Verification Center</h3>
          <span className="text-[10px] text-white/40 px-1.5 py-0.5 rounded-md bg-white/5">KYC · AI Liveness</span>
        </div>
        <button
          onClick={() => setQueueOpen(true)}
          className="text-xs text-white/60 hover:text-white transition"
        >
          Open queue ({queueLeft.length})
        </button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-3">
          <DocCard label="Government ID" tag="ID Front" />
          <DocCard label="Selfie · Liveness" tag="Live Capture" face />
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-xl border border-white/8 p-4 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-white font-semibold">
                  {initials(selected.name)}
                </div>
                <BadgeCheck className="absolute -bottom-1 -right-1 h-4 w-4 text-[var(--color-cyan)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate">{selected.name}</div>
                <div className="text-[11px] text-white/50 truncate">{selected.role}</div>
              </div>
              <span
                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md"
                style={{ background: s.bg, color: s.fg }}
              >
                {s.label}
              </span>
            </div>

            <Score label="Face Match"          value={selected.faceMatch} color="var(--color-success)" />
            <Score label="Liveness Detection"  value={selected.liveness}  color="var(--color-cyan)" />
            <Score label="Document Quality"    value={selected.docQuality} color="var(--color-primary)" />
            <Score label="AI Fraud Risk"       value={selected.fraudRisk}  color={selected.fraudRisk > 40 ? "var(--color-danger)" : "var(--color-success)"} inverse />

            {["approved", "rejected", "suspended"].includes(selected.status) ? (
              <div className="mt-4 rounded-lg border border-white/8 bg-white/[0.03] p-3 text-[11px] text-white/60 text-center">
                Final decision recorded · <span style={{ color: s.fg }}>{s.label}</span>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={approve}
                  className="h-9 rounded-lg text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5 transition hover:brightness-110"
                  style={{ background: "var(--gradient-primary)", boxShadow: "0 8px 24px -10px oklch(0.62 0.21 275 / 0.7)" }}
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
                <button
                  onClick={reupload}
                  className="h-9 rounded-lg text-xs font-semibold text-white/80 hover:text-white border border-white/10 hover:bg-white/5 inline-flex items-center justify-center gap-1.5 transition"
                >
                  <RotateCw className="h-3.5 w-3.5" /> Re-upload
                </button>
                <button
                  onClick={() => setRejectOpen(true)}
                  className="h-9 rounded-lg text-xs font-semibold text-[var(--color-danger)] border border-[oklch(0.65_0.23_27_/_0.4)] hover:bg-[oklch(0.65_0.23_27_/_0.08)] inline-flex items-center justify-center gap-1.5 transition"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </button>
                <button
                  onClick={suspend}
                  className="h-9 rounded-lg text-xs font-semibold text-white/70 hover:text-white border border-white/10 hover:bg-white/5 inline-flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldX className="h-3.5 w-3.5" /> Suspend
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 space-y-1.5">
            {items.filter((c) => c.id !== selected.id).slice(0, 4).map((p) => {
              const ps = STATUS_STYLE[p.status];
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition text-left"
                >
                  <div className="h-8 w-8 rounded-full bg-white/5 grid place-items-center text-[10px] text-white/70">
                    {initials(p.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">{p.name}</div>
                    <div className="text-[10px] text-white/45 truncate">{p.role}</div>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: ps.bg, color: ps.fg }}>
                    {ps.label}
                  </span>
                  <div className="text-[10px] tabular-nums w-9 text-right" style={{ color: ps.fg }}>{p.score}%</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reject reason dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="bg-[oklch(0.18_0.04_265)] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Reject {selected.name}</DialogTitle>
            <DialogDescription className="text-white/55">
              Provide a reason. The worker will see this in their verification status.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Document is blurred and ID number is unreadable…"
            className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/30"
          />
          <DialogFooter>
            <Button variant="outline" className="border-white/10 bg-transparent text-white hover:bg-white/5" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button onClick={confirmReject} className="bg-[oklch(0.65_0.23_27)] text-white hover:brightness-110">
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Full queue sheet */}
      <Sheet open={queueOpen} onOpenChange={setQueueOpen}>
        <SheetContent className="bg-[oklch(0.18_0.04_265)] border-white/10 text-white sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-white">Verification queue</SheetTitle>
            <SheetDescription className="text-white/55">
              {queueLeft.length} awaiting action · {items.length} total
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <Input
              value={queueQuery}
              onChange={(e) => setQueueQuery(e.target.value)}
              placeholder="Search name or role…"
              className="pl-8 bg-white/[0.03] border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          <div className="mt-3 space-y-1">
            {filteredQueue.map((c) => {
              const cs = STATUS_STYLE[c.status];
              const active = c.id === selected.id;
              return (
                <button
                  key={c.id}
                  onClick={() => { setSelectedId(c.id); setQueueOpen(false); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition text-left border ${active ? "border-white/15 bg-white/[0.05]" : "border-transparent hover:bg-white/[0.04]"}`}
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500/60 to-cyan-400/60 grid place-items-center text-[11px] text-white font-medium">
                    {initials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{c.name}</div>
                    <div className="text-[10px] text-white/45 truncate">{c.role}</div>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: cs.bg, color: cs.fg }}>
                    {cs.label}
                  </span>
                  <div className="text-[10px] tabular-nums w-9 text-right text-white/70">{c.score}%</div>
                </button>
              );
            })}
            {filteredQueue.length === 0 && (
              <div className="text-center text-xs text-white/40 py-8">No matches.</div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DocCard({ label, tag, face }: { label: string; tag: string; face?: boolean }) {
  return (
    <div className="relative rounded-xl border border-white/8 overflow-hidden bg-gradient-to-br from-white/[0.04] to-white/[0.01] aspect-[4/3]">
      <div className="absolute inset-0 grid place-items-center">
        {face ? (
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400/30 to-cyan-400/20 grid place-items-center">
              <ScanFace className="h-10 w-10 text-white/70" />
            </div>
            <div className="absolute -inset-2 rounded-full border border-[var(--color-cyan)]/40 animate-ping" />
          </div>
        ) : (
          <FileImage className="h-12 w-12 text-white/30" />
        )}
      </div>
      {[
        "top-2 left-2 border-t border-l",
        "top-2 right-2 border-t border-r",
        "bottom-2 left-2 border-b border-l",
        "bottom-2 right-2 border-b border-r",
      ].map((p, i) => (
        <span key={i} className={`absolute h-3 w-3 ${p} border-[var(--color-primary)]/70`} />
      ))}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wider bg-black/40 text-white/80">
        {tag}
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white/70">
        <span className="font-medium">{label}</span>
        <span className="px-1.5 py-0.5 rounded bg-[var(--color-success)]/15 text-[var(--color-success)]">Verified</span>
      </div>
    </div>
  );
}

function Score({ label, value, color, inverse }: { label: string; value: number; color: string; inverse?: boolean }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-white/55">{label}</span>
        <span className="text-white tabular-nums font-medium">{value}{inverse ? "" : "%"}</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color, boxShadow: `0 0 12px ${color}` }} />
      </div>
    </div>
  );
}
