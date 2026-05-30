import { useEffect, useRef, useState } from "react";
import { Plus, Minus, Layers, Crosshair, Maximize2 } from "lucide-react";
import { toast } from "sonner";

interface Pin { id: number; x: number; y: number; type: "worker" | "job" | "business" | "emergency"; }

const pins: Pin[] = [
  { id: 1, x: 18, y: 32, type: "worker" },
  { id: 2, x: 35, y: 48, type: "job" },
  { id: 3, x: 52, y: 30, type: "worker" },
  { id: 4, x: 64, y: 60, type: "business" },
  { id: 5, x: 72, y: 22, type: "emergency" },
  { id: 6, x: 28, y: 70, type: "worker" },
  { id: 7, x: 80, y: 70, type: "job" },
  { id: 8, x: 45, y: 78, type: "business" },
  { id: 9, x: 88, y: 42, type: "worker" },
  { id: 10, x: 12, y: 56, type: "job" },
];

const colors: Record<Pin["type"], string> = {
  worker: "var(--color-cyan)",
  job: "var(--color-primary)",
  business: "var(--color-success)",
  emergency: "var(--color-danger)",
};

export function MapPanel() {
  const [tick, setTick] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeLayers, setActiveLayers] = useState<Record<Pin["type"], boolean>>({
    worker: true, job: true, business: true, emergency: true,
  });
  const [layersOpen, setLayersOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 2200);
    return () => clearInterval(t);
  }, []);

  const zoomIn = () => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
  const recenter = () => { setPan({ x: 0, y: 0 }); setZoom(1); toast("Map recentered"); };
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => toast.error("Fullscreen not available"));
  };
  const toggleLayer = (k: Pin["type"]) =>
    setActiveLayers((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div ref={containerRef} className="relative rounded-2xl glass gradient-border overflow-hidden h-[460px]">
      {/* Map base */}
      <div className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, oklch(0.62 0.21 275 / 0.18), transparent 55%)," +
            "radial-gradient(ellipse at 80% 80%, oklch(0.74 0.15 210 / 0.16), transparent 55%)," +
            "linear-gradient(180deg, oklch(0.20 0.04 265), oklch(0.16 0.035 264))",
        }} />

      {/* Zoom/pan transform wrapper */}
      <div
        className="absolute inset-0 transition-transform duration-300"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center" }}
      >
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.18]" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(1 0 0 / 0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Geofence circles */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="35" cy="48" r="14" fill="oklch(0.62 0.21 275 / 0.06)" stroke="oklch(0.62 0.21 275 / 0.4)" strokeWidth="0.2" strokeDasharray="1 1" />
          <circle cx="72" cy="22" r="9"  fill="oklch(0.65 0.23 27 / 0.08)"  stroke="oklch(0.65 0.23 27 / 0.5)"  strokeWidth="0.2" strokeDasharray="1 1" />
          <path d="M 18 32 Q 30 40 35 48" stroke="oklch(0.74 0.15 210 / 0.6)" strokeWidth="0.3" fill="none" strokeDasharray="1 0.6" />
          <path d="M 52 30 Q 60 40 64 60" stroke="oklch(0.74 0.15 210 / 0.6)" strokeWidth="0.3" fill="none" strokeDasharray="1 0.6" />
        </svg>

        {/* Pins */}
        {pins.filter((p) => activeLayers[p.type]).map((p) => (
          <button key={p.id}
            onClick={() => toast(`${p.type.toUpperCase()} #${p.id}`, { description: `Lat/Lng ${p.x.toFixed(1)}, ${p.y.toFixed(1)}` })}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
            style={{
              left: `${p.x + (p.type === "worker" ? Math.sin(tick + p.id) * 1.2 : 0)}%`,
              top: `${p.y + (p.type === "worker" ? Math.cos(tick + p.id) * 1.2 : 0)}%`,
            }}>
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
                style={{ background: colors[p.type] }} />
              <span className="relative inline-flex h-3 w-3 rounded-full ring-2 ring-[var(--color-background)]"
                style={{ background: colors[p.type], boxShadow: `0 0 12px ${colors[p.type]}` }} />
            </span>
          </button>
        ))}
      </div>

      {/* Header overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">Live Operations Map</h3>
          <p className="text-[11px] text-white/50 mt-0.5">Real-time worker, job, and business tracking</p>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          {(["worker","job","business","emergency"] as const).map((k) => (
            <button
              key={k}
              onClick={() => toggleLayer(k)}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg glass text-[10px] text-white/70 capitalize hover:text-white transition"
              style={{ opacity: activeLayers[k] ? 1 : 0.4 }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: colors[k] }} />{k}
            </button>
          ))}
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute right-4 bottom-4 flex flex-col rounded-xl glass overflow-hidden">
        <button onClick={zoomIn} aria-label="Zoom in" className="grid place-items-center h-9 w-9 text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5"><Plus className="h-4 w-4" /></button>
        <button onClick={zoomOut} aria-label="Zoom out" className="grid place-items-center h-9 w-9 text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5"><Minus className="h-4 w-4" /></button>
        <button onClick={recenter} aria-label="Recenter" className="grid place-items-center h-9 w-9 text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5"><Crosshair className="h-4 w-4" /></button>
        <button onClick={() => setLayersOpen((v) => !v)} aria-label="Layers" className="grid place-items-center h-9 w-9 text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5"><Layers className="h-4 w-4" /></button>
        <button onClick={toggleFullscreen} aria-label="Fullscreen" className="grid place-items-center h-9 w-9 text-white/70 hover:text-white hover:bg-white/5"><Maximize2 className="h-4 w-4" /></button>
      </div>

      {layersOpen && (
        <div className="absolute right-16 bottom-4 rounded-xl glass p-3 text-[11px] text-white/70 space-y-1.5 min-w-[140px]">
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Layers</div>
          {(["worker","job","business","emergency"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer capitalize">
              <input type="checkbox" checked={activeLayers[k]} onChange={() => toggleLayer(k)} className="accent-[var(--color-primary)]" />
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: colors[k] }} />
              {k}
            </label>
          ))}
        </div>
      )}

      {/* Stat overlay */}
      <div className="absolute left-4 bottom-4 rounded-xl glass p-3 min-w-[180px]">
        <div className="text-[10px] uppercase tracking-wider text-white/40">Active in zone</div>
        <div className="mt-1 text-2xl font-semibold text-white tabular-nums">2,481</div>
        <div className="mt-1 text-[11px] text-[var(--color-success)]">+ 124 last hour</div>
      </div>
    </div>
  );
}
