import { useState } from "react";
import { Search, Bell, Globe, Command, ChevronDown, Activity } from "lucide-react";
import { NotificationsDrawer, useNotifications } from "./NotificationsDrawer";

export function TopBar() {
  const [open, setOpen] = useState(false);
  const notif = useNotifications();

  return (
    <header className="sticky top-0 z-20 h-16 px-6 flex items-center gap-4 backdrop-blur-xl"
      style={{
        background: "linear-gradient(180deg, oklch(0.18 0.04 264 / 0.85), oklch(0.18 0.04 264 / 0.6))",
        borderBottom: "1px solid oklch(1 0 0 / 0.06)",
      }}>
      {/* Search */}
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
        <input
          placeholder="Search workers, jobs, transactions, disputes…"
          className="w-full h-10 pl-10 pr-20 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/35 outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] text-white/40 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10">
          <Command className="h-3 w-3" /> K
        </kbd>
      </div>

      {/* Status */}
      <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-xl glass">
        <span className="pulse-dot" />
        <span className="text-xs text-white/70">All systems operational</span>
        <span className="text-[10px] text-white/40 ml-1">99.998% uptime</span>
      </div>

      <div className="hidden lg:flex items-center gap-1.5 px-3 h-9 rounded-xl glass text-xs text-white/70">
        <Activity className="h-3.5 w-3.5 text-[var(--color-cyan)]" />
        <span>1,284 live ops</span>
      </div>

      {/* Language */}
      <button className="hidden md:flex items-center gap-1.5 px-3 h-9 rounded-xl text-xs text-white/70 hover:bg-white/5 transition">
        <Globe className="h-4 w-4" /> EN
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {/* Notifications */}
      <button
        onClick={() => setOpen(true)}
        aria-label={`Notifications, ${notif.unread} unread`}
        className="relative grid place-items-center h-10 w-10 rounded-xl hover:bg-white/5 transition"
      >
        <Bell className="h-[18px] w-[18px] text-white/70" />
        {notif.unread > 0 && (
          <span
            className="absolute top-2 right-2 h-4 min-w-4 px-1 grid place-items-center text-[9px] font-bold text-white rounded-full ring-2 ring-[oklch(0.18_0.04_264)]"
            style={{ background: "var(--gradient-danger)" }}
          >
            {notif.unread > 9 ? "9+" : notif.unread}
          </span>
        )}
        {notif.unread > 0 && (
          <span className="absolute top-2 right-2 h-4 w-4 rounded-full opacity-60 animate-ping"
            style={{ background: "oklch(0.65 0.23 27 / 0.7)" }} />
        )}
      </button>

      {/* Profile */}
      <button className="flex items-center gap-2.5 pl-2 pr-3 h-10 rounded-xl hover:bg-white/5 transition">
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 grid place-items-center text-white text-[10px] font-bold">AK</div>
        <div className="text-left leading-tight hidden sm:block">
          <div className="text-xs font-medium text-white">Alex Kovac</div>
          <div className="text-[10px] text-white/45">Super Admin</div>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-white/50" />
      </button>

      <NotificationsDrawer open={open} onClose={() => setOpen(false)} {...notif} />
    </header>
  );
}
