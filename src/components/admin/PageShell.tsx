import { ReactNode } from "react";

interface PageShellProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ eyebrow, title, description, actions, children }: PageShellProps) {
  return (
    <main className="flex-1 p-6 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">{eyebrow}</div>
          )}
          <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-white">{title}</h1>
          {description && <p className="text-sm text-white/50 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </main>
  );
}

export function EmptyPanel({
  icon: Icon, title, description, hint,
}: { icon: any; title: string; description: string; hint?: string }) {
  return (
    <div className="rounded-2xl glass gradient-border p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl grid place-items-center"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/55 max-w-md mx-auto">{description}</p>
      {hint && <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-white/35">{hint}</p>}
    </div>
  );
}

export function StatTile({
  label, value, accent = "var(--color-primary)",
}: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl glass gradient-border p-5 hover-lift">
      <div className="text-[11px] uppercase tracking-[0.14em] text-white/45 font-medium">{label}</div>
      <div className="mt-2 text-[24px] font-semibold text-white tracking-tight tabular-nums">{value}</div>
      <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: "62%", background: accent, boxShadow: `0 0 12px ${accent}` }} />
      </div>
    </div>
  );
}
