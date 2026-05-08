import { useState } from "react";
import {
  LayoutDashboard, Radio, Users, HardHat, Building2, ShieldCheck,
  CreditCard, Gavel, Bell, FileBarChart, BarChart3, Settings,
  UserCog, ShieldAlert, LifeBuoy, ChevronLeft, LogOut, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, badge: null },
  { label: "Live Jobs", icon: Radio, badge: "128" },
  { label: "Users", icon: Users, badge: null },
  { label: "Workers", icon: HardHat, badge: null },
  { label: "Businesses", icon: Building2, badge: null },
  { label: "Verification Center", icon: ShieldCheck, badge: "24" },
  { label: "Payments", icon: CreditCard, badge: null },
  { label: "Disputes", icon: Gavel, badge: "7" },
  { label: "Notifications", icon: Bell, badge: null },
  { label: "Reports", icon: FileBarChart, badge: null },
  { label: "Analytics", icon: BarChart3, badge: null },
  { label: "Admin Management", icon: UserCog, badge: null },
  { label: "Fraud Detection", icon: ShieldAlert, badge: "3" },
  { label: "Support Tickets", icon: LifeBuoy, badge: "12" },
  { label: "Settings", icon: Settings, badge: null },
];

export function AppSidebar({
  active, onSelect,
}: { active: string; onSelect: (s: string) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 transition-all duration-300 z-30",
        collapsed ? "w-[76px]" : "w-[260px]",
      )}
      style={{ background: "var(--color-sidebar)" }}
    >
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="grid place-items-center h-9 w-9 rounded-xl shrink-0"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <Sparkles className="h-4.5 w-4.5 text-white" size={18} />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <div className="text-[15px] font-semibold tracking-tight text-white">Nexora</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Super Admin</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="grid place-items-center h-7 w-7 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          {!collapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
              Operations
            </div>
          )}
          <ul className="space-y-0.5">
            {items.map((item) => {
              const isActive = item.label === active;
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    onClick={() => onSelect(item.label)}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: "linear-gradient(135deg, oklch(0.62 0.21 275 / 0.25), oklch(0.74 0.15 210 / 0.12))",
                          boxShadow: "inset 0 0 0 1px oklch(0.62 0.21 275 / 0.5), 0 8px 24px -10px oklch(0.62 0.21 275 / 0.6)",
                        }}
                      />
                    )}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full"
                        style={{ background: "var(--gradient-primary)" }} />
                    )}
                    <Icon className={cn("relative h-[18px] w-[18px] shrink-0", isActive && "text-white")} />
                    {!collapsed && (
                      <>
                        <span className="relative flex-1 text-left font-medium tracking-tight">{item.label}</span>
                        {item.badge && (
                          <span className={cn(
                            "relative ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                            isActive ? "bg-white/15 text-white" : "bg-white/8 text-white/70",
                          )}>{item.badge}</span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom profile */}
        <div className="border-t border-white/5 p-3">
          <div className={cn(
            "flex items-center gap-3 rounded-xl p-2 hover:bg-white/5 transition cursor-pointer",
            collapsed && "justify-center",
          )}>
            <div className="relative shrink-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-white text-xs font-bold">
                AK
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-success)] ring-2 ring-[var(--color-sidebar)]" />
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">Alex Kovac</div>
                  <div className="text-[11px] text-white/45 truncate">Super Administrator</div>
                </div>
                <button className="text-white/40 hover:text-white p-1.5 rounded-md hover:bg-white/5">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
