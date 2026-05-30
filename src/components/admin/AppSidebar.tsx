import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Radio, Users, HardHat, Building2, ShieldCheck,
  CreditCard, Gavel, Bell, FileBarChart, BarChart3, Settings,
  UserCog, ShieldAlert, LifeBuoy, ChevronLeft, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export const NAV_ITEMS = [
  { label: "Dashboard",           to: "/",              icon: LayoutDashboard, badge: null   },
  { label: "Live Jobs",           to: "/live-jobs",     icon: Radio,           badge: "128" },
  { label: "Users",               to: "/users",         icon: Users,           badge: null   },
  { label: "Workers",             to: "/workers",       icon: HardHat,         badge: null   },
  { label: "Businesses",          to: "/businesses",    icon: Building2,       badge: null   },
  { label: "Verification Center", to: "/verification",  icon: ShieldCheck,     badge: "24"  },
  { label: "Payments",            to: "/payments",      icon: CreditCard,      badge: null   },
  { label: "Disputes",            to: "/disputes",      icon: Gavel,           badge: "7"   },
  { label: "Notifications",       to: "/notifications", icon: Bell,            badge: null   },
  { label: "Reports",             to: "/reports",       icon: FileBarChart,    badge: null   },
  { label: "Analytics",           to: "/analytics",     icon: BarChart3,       badge: null   },
  { label: "Admin Management",    to: "/admin",         icon: UserCog,         badge: null   },
  { label: "Fraud Detection",     to: "/fraud",         icon: ShieldAlert,     badge: "3"   },
  { label: "Support Tickets",     to: "/support",       icon: LifeBuoy,        badge: "12"  },
  { label: "Settings",            to: "/settings",      icon: Settings,        badge: null   },
] as const;

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="grid place-items-center h-9 w-9 rounded-xl shrink-0 p-1.5"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <img src={logo} alt="Ping" className="h-full w-full object-contain" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <img src={logo} alt="Ping" className="h-5 w-auto" />
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 mt-1">Super Admin</div>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="grid place-items-center h-7 w-7 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          {!collapsed && (
            <div className="px-3 pt-2 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
              Operations
            </div>
          )}
          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                      isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5",
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
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

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
