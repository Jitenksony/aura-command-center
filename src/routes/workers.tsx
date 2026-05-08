import { createFileRoute } from "@tanstack/react-router";
import { CardGridSkeleton } from "@/components/admin/PageSkeletons";
import { Star, MapPin, BadgeCheck, Briefcase } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";

export const Route = createFileRoute("/workers")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<CardGridSkeleton {...{ eyebrow: "Workforce", count: 9 }} />),
  head: () => ({ meta: [{ title: "Workers — Nexora" }] }),
  component: WorkersPage,
});

const workers = [
  { name: "Marcus Thompson",  skill: "Plumbing",   rating: 4.9, jobs: 312, city: "Brooklyn, NY",  earn: 18420, online: true,  verified: true  },
  { name: "Sofia Lin",         skill: "Cleaning",   rating: 4.8, jobs: 248, city: "San Jose, CA",  earn: 12810, online: true,  verified: true  },
  { name: "Carlos Rivera",     skill: "Moving",     rating: 4.7, jobs: 184, city: "Miami, FL",     earn: 22400, online: false, verified: true  },
  { name: "Aisha Khan",        skill: "Cooking",    rating: 5.0, jobs: 96,  city: "Houston, TX",   earn: 7820,  online: true,  verified: true  },
  { name: "Daniel Park",       skill: "Electrical", rating: 4.6, jobs: 421, city: "Seattle, WA",   earn: 31500, online: false, verified: true  },
  { name: "Helena Novak",      skill: "Tutoring",   rating: 4.9, jobs: 73,  city: "Prague, CZ",    earn: 4280,  online: true,  verified: false },
];

function WorkersPage() {
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
              <button className="flex-1 h-8 text-xs rounded-lg text-white" style={{ background: "var(--gradient-primary)" }}>View</button>
              <button className="flex-1 h-8 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5">Message</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
