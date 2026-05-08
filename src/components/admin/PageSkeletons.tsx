import { ReactNode } from "react";

/* ---------- Primitives ---------- */

export function SkelBlock({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-white/[0.05] ${className}`}
      style={style}
    >
      <div className="absolute inset-0 shimmer" />
    </div>
  );
}

function SkelHeader({
  eyebrow = "Loading",
  titleW = "w-64",
  descW = "w-96",
  actions = 2,
}: {
  eyebrow?: string;
  titleW?: string;
  descW?: string;
  actions?: number;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/30">{eyebrow}</div>
        <SkelBlock className={`h-8 ${titleW} rounded-lg`} />
        <SkelBlock className={`h-3.5 ${descW} mt-2`} />
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: actions }).map((_, i) => (
          <SkelBlock key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function SkelStatTile() {
  return (
    <div className="rounded-2xl glass gradient-border p-5">
      <SkelBlock className="h-3 w-20" />
      <SkelBlock className="h-7 w-28 mt-3 rounded-lg" />
      <SkelBlock className="h-1 w-full mt-4 rounded-full" />
    </div>
  );
}

function SkelStatGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkelStatTile key={i} />
      ))}
    </div>
  );
}

function SkelCard({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <div className={`rounded-2xl glass gradient-border p-5 ${className}`}>{children}</div>;
}

function SkelTable({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <SkelCard>
      <div className="flex items-center justify-between mb-5">
        <SkelBlock className="h-5 w-40" />
        <div className="flex gap-2">
          <SkelBlock className="h-9 w-56 rounded-lg" />
          <SkelBlock className="h-9 w-9 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkelBlock key={`h-${i}`} className="h-3 w-20" />
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid gap-2.5 py-2 border-t border-white/5"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
          >
            {Array.from({ length: cols }).map((_, c) => (
              <SkelBlock
                key={c}
                className={`h-4 ${c === 0 ? "w-32" : c === cols - 1 ? "w-16" : "w-24"}`}
              />
            ))}
          </div>
        ))}
      </div>
    </SkelCard>
  );
}

function SkelChart({ height = 280 }: { height?: number }) {
  return (
    <SkelCard>
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-2">
          <SkelBlock className="h-4 w-40" />
          <SkelBlock className="h-3 w-56" />
        </div>
        <SkelBlock className="h-8 w-24 rounded-lg" />
      </div>
      <div className="relative" style={{ height }}>
        <SkelBlock className="absolute inset-0 rounded-xl" />
      </div>
    </SkelCard>
  );
}

function SkelMap() {
  return (
    <SkelCard className="p-0 overflow-hidden">
      <div className="relative h-[480px]">
        <SkelBlock className="absolute inset-0 rounded-2xl" />
        <div className="absolute top-4 left-4 space-y-2">
          <SkelBlock className="h-8 w-40 rounded-lg" />
          <SkelBlock className="h-8 w-28 rounded-lg" />
        </div>
        <div className="absolute bottom-4 right-4">
          <SkelBlock className="h-16 w-32 rounded-xl" />
        </div>
      </div>
    </SkelCard>
  );
}

function SkelShell({ children }: { children: ReactNode }) {
  return <main className="flex-1 p-6 space-y-6">{children}</main>;
}

/* ---------- Per-page variants ---------- */

export function DashboardSkeleton() {
  return (
    <SkelShell>
      <SkelHeader eyebrow="Operations Overview" titleW="w-72" descW="w-80" actions={3} />
      <SkelStatGrid count={4} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2"><SkelChart height={300} /></div>
        <SkelCard>
          <SkelBlock className="h-4 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <SkelBlock className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <SkelBlock className="h-3 w-3/4" />
                  <SkelBlock className="h-2.5 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </SkelCard>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SkelMap />
        <SkelTable rows={6} cols={5} />
      </div>
    </SkelShell>
  );
}

export function TableSkeleton({
  eyebrow = "Loading",
  stats = 4,
  rows = 9,
  cols = 6,
}: { eyebrow?: string; stats?: number; rows?: number; cols?: number }) {
  return (
    <SkelShell>
      <SkelHeader eyebrow={eyebrow} actions={2} />
      {stats > 0 && <SkelStatGrid count={stats} />}
      <SkelTable rows={rows} cols={cols} />
    </SkelShell>
  );
}

export function MapSkeleton() {
  return (
    <SkelShell>
      <SkelHeader eyebrow="Real-time Marketplace" titleW="w-48" actions={2} />
      <SkelStatGrid count={4} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2"><SkelMap /></div>
        <SkelCard>
          <SkelBlock className="h-4 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-t border-white/5 first:border-0">
                <SkelBlock className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <SkelBlock className="h-3 w-4/5" />
                  <SkelBlock className="h-2.5 w-2/5" />
                </div>
                <SkelBlock className="h-6 w-14 rounded-md" />
              </div>
            ))}
          </div>
        </SkelCard>
      </div>
    </SkelShell>
  );
}

export function AnalyticsSkeleton() {
  return (
    <SkelShell>
      <SkelHeader eyebrow="Insights" titleW="w-44" descW="w-72" actions={2} />
      <SkelStatGrid count={4} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2"><SkelChart height={320} /></div>
        <SkelChart height={320} />
      </div>
      <SkelChart height={260} />
    </SkelShell>
  );
}

export function CardGridSkeleton({
  eyebrow = "Loading",
  count = 9,
}: { eyebrow?: string; count?: number }) {
  return (
    <SkelShell>
      <SkelHeader eyebrow={eyebrow} actions={2} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkelCard key={i}>
            <div className="flex items-start gap-3">
              <SkelBlock className="h-10 w-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <SkelBlock className="h-4 w-3/5" />
                <SkelBlock className="h-3 w-full" />
                <SkelBlock className="h-3 w-4/5" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <SkelBlock className="h-6 w-16 rounded-md" />
              <SkelBlock className="h-6 w-20 rounded-md" />
              <SkelBlock className="h-6 w-14 rounded-md" />
            </div>
          </SkelCard>
        ))}
      </div>
    </SkelShell>
  );
}

export function FormSkeleton({ eyebrow = "Configuration" }: { eyebrow?: string }) {
  return <CardGridSkeleton eyebrow={eyebrow} count={8} />;
}

export function SplitSkeleton({ eyebrow = "Loading" }: { eyebrow?: string }) {
  return (
    <SkelShell>
      <SkelHeader eyebrow={eyebrow} actions={2} />
      <SkelStatGrid count={3} />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SkelCard className="xl:col-span-1">
          <SkelBlock className="h-4 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-t border-white/5 first:border-0">
                <SkelBlock className="h-8 w-8 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <SkelBlock className="h-3 w-3/4" />
                  <SkelBlock className="h-2.5 w-2/5" />
                </div>
              </div>
            ))}
          </div>
        </SkelCard>
        <SkelCard className="xl:col-span-2">
          <SkelBlock className="h-4 w-40 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkelBlock key={i} className={`h-12 ${i % 3 === 0 ? "w-4/5" : i % 3 === 1 ? "w-3/4 ml-auto" : "w-2/3"} rounded-xl`} />
            ))}
          </div>
        </SkelCard>
      </div>
    </SkelShell>
  );
}
