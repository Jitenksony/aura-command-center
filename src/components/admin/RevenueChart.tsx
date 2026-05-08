import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = Array.from({ length: 24 }, (_, i) => ({
  h: `${i.toString().padStart(2, "0")}:00`,
  revenue: Math.round(40 + Math.sin(i / 2) * 22 + Math.random() * 18 + i * 1.4),
  payouts: Math.round(28 + Math.cos(i / 3) * 14 + Math.random() * 10 + i * 1.1),
}));

export function RevenueChart() {
  return (
    <div className="rounded-2xl glass gradient-border p-5 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Platform Revenue</h3>
          <p className="text-[11px] text-white/45 mt-0.5">Hourly · last 24h</p>
        </div>
        <div className="flex items-center gap-3">
          <Legend dot="var(--color-primary)" label="Revenue" />
          <Legend dot="var(--color-cyan)" label="Payouts" />
        </div>
      </div>
      <div className="flex items-end gap-6 mb-4">
        <div>
          <div className="text-[26px] font-semibold text-white tabular-nums">$184,290</div>
          <div className="text-[11px] text-[var(--color-success)] mt-0.5">+18.4% vs yesterday</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/70 tabular-nums">$72,140</div>
          <div className="text-[11px] text-white/40">Net commission</div>
        </div>
      </div>
      <div className="h-[220px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.62 0.21 275)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="oklch(0.62 0.21 275)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.74 0.15 210)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="oklch(0.74 0.15 210)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
            <XAxis dataKey="h" tick={{ fill: "oklch(1 0 0 / 0.4)", fontSize: 10 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis tick={{ fill: "oklch(1 0 0 / 0.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip
              cursor={{ stroke: "oklch(1 0 0 / 0.15)", strokeWidth: 1 }}
              contentStyle={{
                background: "oklch(0.20 0.04 265 / 0.95)",
                border: "1px solid oklch(1 0 0 / 0.1)",
                borderRadius: 12, fontSize: 12, color: "white",
                boxShadow: "0 10px 40px -10px oklch(0 0 0 / 0.6)",
              }}
            />
            <Area type="monotone" dataKey="payouts" stroke="oklch(0.74 0.15 210)" strokeWidth={2} fill="url(#pay)" />
            <Area type="monotone" dataKey="revenue" stroke="oklch(0.62 0.21 275)" strokeWidth={2} fill="url(#rev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-white/60">
      <span className="h-2 w-2 rounded-full" style={{ background: dot }} />{label}
    </span>
  );
}
