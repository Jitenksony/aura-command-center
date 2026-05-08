import { createFileRoute } from "@tanstack/react-router";
import { Radio, MapPin, Clock, DollarSign, Filter, Plus } from "lucide-react";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { MapPanel } from "@/components/admin/MapPanel";

export const Route = createFileRoute("/live-jobs")({
  head: () => ({ meta: [{ title: "Live Jobs — Nexora" }] }),
  component: LiveJobsPage,
});

const jobs = [
  { id: "J-2914", title: "Emergency plumbing repair",  category: "Plumbing",   price: 220, city: "Brooklyn, NY",  status: "Dispatched", color: "var(--color-cyan)",    eta: "12m" },
  { id: "J-2913", title: "Furniture moving · 2 movers", category: "Moving",     price: 480, city: "Austin, TX",    status: "In Progress", color: "var(--color-success)", eta: "1h 20m" },
  { id: "J-2912", title: "Deep house cleaning",         category: "Cleaning",   price: 160, city: "San Diego, CA", status: "Posted",      color: "var(--color-primary)", eta: "—" },
  { id: "J-2911", title: "TV mounting · 65 inch",       category: "Handyman",   price: 110, city: "Chicago, IL",   status: "Accepted",    color: "var(--color-cyan)",    eta: "32m" },
  { id: "J-2910", title: "Yard cleanup & hauling",      category: "Outdoor",    price: 290, city: "Denver, CO",    status: "Dispatched", color: "var(--color-cyan)",    eta: "8m" },
  { id: "J-2909", title: "AC unit installation",        category: "HVAC",       price: 640, city: "Phoenix, AZ",   status: "In Progress", color: "var(--color-success)", eta: "2h" },
  { id: "J-2908", title: "Electrical outlet repair",    category: "Electrical", price: 95,  city: "Seattle, WA",   status: "Posted",      color: "var(--color-primary)", eta: "—" },
  { id: "J-2907", title: "Catering staff · evening",    category: "Events",     price: 380, city: "Miami, FL",     status: "Accepted",    color: "var(--color-cyan)",    eta: "45m" },
];

function LiveJobsPage() {
  return (
    <PageShell
      eyebrow="Real-time Marketplace"
      title="Live Jobs"
      description="Monitor every active job across regions with real-time dispatch status."
      actions={
        <>
          <button className="h-9 px-3 text-xs rounded-lg border border-white/10 text-white/70 hover:bg-white/5 inline-flex items-center gap-1.5"><Filter className="h-3.5 w-3.5" /> Filters</button>
          <button className="h-9 px-3 text-xs rounded-lg text-white inline-flex items-center gap-1.5" style={{ background: "var(--gradient-primary)" }}><Plus className="h-3.5 w-3.5" /> New Dispatch</button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Posted" value="318" accent="var(--color-primary)" />
        <StatTile label="Accepted" value="412" accent="var(--color-cyan)" />
        <StatTile label="In Progress" value="486" accent="var(--color-success)" />
        <StatTile label="Avg dispatch time" value="2m 41s" accent="var(--color-warning)" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-7"><MapPanel /></div>
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl glass gradient-border h-[460px] flex flex-col">
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
              <span className="pulse-dot" />
              <h3 className="text-sm font-semibold text-white">Live job stream</h3>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
              <ul className="space-y-1">
                {jobs.map((j) => (
                  <li key={j.id} className="rounded-xl p-3 hover:bg-white/[0.04] transition cursor-pointer">
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
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl glass gradient-border overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
          <Radio className="h-4 w-4 text-[var(--color-cyan)]" />
          <h3 className="text-sm font-semibold text-white">All active jobs</h3>
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
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-white/5 hover:bg-white/[0.025]">
                <td className="px-5 py-3">
                  <div className="text-white font-medium">{j.title}</div>
                  <div className="text-[11px] text-white/40 font-mono">{j.id}</div>
                </td>
                <td className="px-5 py-3 text-white/70">{j.category}</td>
                <td className="px-5 py-3 text-white/70">{j.city}</td>
                <td className="px-5 py-3"><span className="text-[11px] px-2 py-0.5 rounded" style={{ background: "oklch(1 0 0 / 0.06)", color: j.color }}>{j.status}</span></td>
                <td className="px-5 py-3 text-right text-white/70 tabular-nums">{j.eta}</td>
                <td className="px-5 py-3 text-right text-white font-semibold tabular-nums inline-flex items-center justify-end gap-1 w-full"><DollarSign className="h-3.5 w-3.5 text-white/40" />{j.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
