import { Check, X, RotateCw, ShieldX, BadgeCheck, ScanFace, FileImage } from "lucide-react";

const candidates = [
  { name: "Sofia Martinez", role: "Plumber · NYC", score: 96, status: "pending", color: "var(--color-warning)" },
  { name: "Kenji Watanabe", role: "Mover · Austin", score: 89, status: "review", color: "var(--color-cyan)" },
  { name: "Amara Okonkwo", role: "Cleaner · Lagos", score: 42, status: "risk", color: "var(--color-danger)" },
];

export function VerificationPanel() {
  const c = candidates[0];
  return (
    <div className="rounded-2xl glass gradient-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScanFace className="h-4 w-4 text-[var(--color-primary)]" />
          <h3 className="text-sm font-semibold text-white tracking-tight">Worker Verification Center</h3>
          <span className="text-[10px] text-white/40 px-1.5 py-0.5 rounded-md bg-white/5">KYC · AI Liveness</span>
        </div>
        <button className="text-xs text-white/50 hover:text-white">Open queue (24)</button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Documents split view */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-3">
          <DocCard label="Government ID" tag="ID Front" />
          <DocCard label="Selfie · Liveness" tag="Live Capture" face />
        </div>

        {/* Profile + actions */}
        <div className="col-span-12 lg:col-span-5">
          <div className="rounded-xl border border-white/8 p-4 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-white font-semibold">SM</div>
                <BadgeCheck className="absolute -bottom-1 -right-1 h-4 w-4 text-[var(--color-cyan)]" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">{c.name}</div>
                <div className="text-[11px] text-white/50">{c.role}</div>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-md"
                style={{ background: "oklch(0.82 0.17 85 / 0.15)", color: "var(--color-warning)" }}>Pending</span>
            </div>

            <Score label="Face Match" value={97} color="var(--color-success)" />
            <Score label="Liveness Detection" value={94} color="var(--color-cyan)" />
            <Score label="Document Quality" value={88} color="var(--color-primary)" />
            <Score label="AI Fraud Risk" value={6}  color="var(--color-success)" inverse />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="h-9 rounded-lg text-xs font-semibold text-white inline-flex items-center justify-center gap-1.5 transition hover:brightness-110"
                style={{ background: "var(--gradient-primary)", boxShadow: "0 8px 24px -10px oklch(0.62 0.21 275 / 0.7)" }}>
                <Check className="h-3.5 w-3.5" /> Approve
              </button>
              <button className="h-9 rounded-lg text-xs font-semibold text-white/80 hover:text-white border border-white/10 hover:bg-white/5 inline-flex items-center justify-center gap-1.5 transition">
                <RotateCw className="h-3.5 w-3.5" /> Re-upload
              </button>
              <button className="h-9 rounded-lg text-xs font-semibold text-[var(--color-danger)] border border-[oklch(0.65_0.23_27_/_0.4)] hover:bg-[oklch(0.65_0.23_27_/_0.08)] inline-flex items-center justify-center gap-1.5 transition">
                <X className="h-3.5 w-3.5" /> Reject
              </button>
              <button className="h-9 rounded-lg text-xs font-semibold text-white/70 hover:text-white border border-white/10 hover:bg-white/5 inline-flex items-center justify-center gap-1.5 transition">
                <ShieldX className="h-3.5 w-3.5" /> Suspend
              </button>
            </div>
          </div>

          {/* Queue mini */}
          <div className="mt-3 space-y-1.5">
            {candidates.slice(1).map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] transition cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-white/5 grid place-items-center text-[10px] text-white/70">
                  {p.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-white/45 truncate">{p.role}</div>
                </div>
                <div className="text-[10px] tabular-nums" style={{ color: p.color }}>{p.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
      {/* corner brackets */}
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
