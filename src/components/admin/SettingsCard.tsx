import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export function SettingsCard({
  icon: Icon, title, description, children, footer,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-2xl glass gradient-border overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-start gap-3">
        <div
          className="grid place-items-center h-9 w-9 rounded-lg shrink-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.62 0.21 275 / 0.25), oklch(0.74 0.15 210 / 0.15))",
            border: "1px solid oklch(1 0 0 / 0.08)",
          }}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {description && <p className="text-[11px] text-white/50 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
      {footer && <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02] flex justify-end gap-2">{footer}</div>}
    </div>
  );
}

export function FieldRow({
  label, hint, children,
}: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 border-b border-white/5 last:border-b-0">
      <div className="md:col-span-1">
        <div className="text-xs font-medium text-white/85">{label}</div>
        {hint && <div className="text-[11px] text-white/45 mt-0.5">{hint}</div>}
      </div>
      <div className="md:col-span-2">{children}</div>
    </div>
  );
}

export function ProviderRow({
  name, status, region, onToggle, enabled,
}: {
  name: string;
  status: string;
  region?: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
      <div>
        <div className="text-sm text-white font-medium">{name}</div>
        <div className="text-[11px] text-white/45 mt-0.5">
          {status}{region ? ` · ${region}` : ""}
        </div>
      </div>
      <button
        onClick={onToggle}
        aria-pressed={enabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${enabled ? "bg-[var(--color-primary)]" : "bg-white/10"}`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white transition ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export function SaveButton({ onClick, label = "Save changes" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-4 text-xs rounded-lg text-white"
      style={{ background: "var(--gradient-primary)" }}
    >
      {label}
    </button>
  );
}

export function SecondaryButton({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-4 text-xs rounded-lg border border-white/10 text-white/80 hover:bg-white/5"
    >
      {children}
    </button>
  );
}
