import { useEffect, useState } from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta: number;
  icon: LucideIcon;
  tone?: "primary" | "cyan" | "success" | "danger" | "warning";
  data: number[];
}

const toneMap = {
  primary: { color: "oklch(0.62 0.21 275)", grad: "var(--gradient-primary)" },
  cyan:    { color: "oklch(0.74 0.15 210)", grad: "linear-gradient(135deg, oklch(0.74 0.15 210), oklch(0.62 0.21 275))" },
  success: { color: "oklch(0.72 0.18 150)", grad: "linear-gradient(135deg, oklch(0.72 0.18 150), oklch(0.74 0.15 210))" },
  danger:  { color: "oklch(0.65 0.23 27)",  grad: "var(--gradient-danger)" },
  warning: { color: "oklch(0.82 0.17 85)",  grad: "linear-gradient(135deg, oklch(0.82 0.17 85), oklch(0.65 0.23 27))" },
};

function useCountUp(target: number, duration = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

export function StatCard({ label, value, prefix = "", suffix = "", delta, icon: Icon, tone = "primary", data }: StatCardProps) {
  const n = useCountUp(value);
  const tones = toneMap[tone];
  const positive = delta >= 0;
  const chartData = data.map((v, i) => ({ i, v }));
  const id = `g-${label.replace(/\s/g, "")}`;

  return (
    <div className="group relative rounded-2xl glass gradient-border hover-lift overflow-hidden">
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{ background: tones.grad }} />
      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 font-medium">{label}</div>
            <div className="mt-2 text-[26px] leading-none font-semibold text-white tracking-tight tabular-nums">
              {prefix}{Math.round(n).toLocaleString()}{suffix}
            </div>
          </div>
          <div className="grid place-items-center h-10 w-10 rounded-xl"
            style={{ background: "oklch(1 0 0 / 0.04)", border: "1px solid oklch(1 0 0 / 0.08)" }}>
            <Icon className="h-[18px] w-[18px]" style={{ color: tones.color }} />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md",
            positive ? "text-[var(--color-success)] bg-[oklch(0.72_0.18_150_/_0.1)]"
                     : "text-[var(--color-danger)] bg-[oklch(0.65_0.23_27_/_0.1)]")}>
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta)}%
          </div>
          <span className="text-[10px] text-white/35">vs last 7d</span>
        </div>

        <div className="mt-3 -mx-2 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
              <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tones.color} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={tones.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area dataKey="v" stroke={tones.color} strokeWidth={1.75} fill={`url(#${id})`} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
