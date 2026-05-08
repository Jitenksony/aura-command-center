import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Globe, MapPin, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsCard, FieldRow, SaveButton, SecondaryButton } from "@/components/admin/SettingsCard";

export const Route = createFileRoute("/settings/geo")({
  head: () => ({ meta: [{ title: "Geo — Settings — Nexora" }] }),
  component: GeoSettings,
});

const REGIONS = [
  { code: "NA", name: "North America" },
  { code: "EU", name: "Europe" },
  { code: "LATAM", name: "Latin America" },
  { code: "APAC", name: "Asia-Pacific" },
  { code: "MEA", name: "Middle East & Africa" },
];

function GeoSettings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    NA: true, EU: true, LATAM: true, APAC: false, MEA: false,
  });
  const [restricted, setRestricted] = useState<string[]>(["KP", "IR", "SY", "CU"]);
  const [newCountry, setNewCountry] = useState("");
  const [defaultRadius, setDefaultRadius] = useState("12");
  const [maxRadius, setMaxRadius] = useState("50");
  const [unit, setUnit] = useState("km");

  const inputCls = "h-9 bg-white/5 border-white/10 text-white text-xs";
  const activeRegions = Object.values(enabled).filter(Boolean).length;

  return (
    <>
      <SettingsCard
        icon={Globe}
        title="Active regions"
        description={`Nexora is currently live in ${activeRegions} of ${REGIONS.length} regions.`}
        footer={<SaveButton onClick={() => toast.success("Regions updated")} />}
      >
        {REGIONS.map((r) => (
          <div key={r.code} className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
            <div>
              <div className="text-xs font-medium text-white/85">{r.name}</div>
              <div className="text-[11px] text-white/45 mt-0.5">Region · {r.code}</div>
            </div>
            <button
              onClick={() => setEnabled({ ...enabled, [r.code]: !enabled[r.code] })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${enabled[r.code] ? "bg-[var(--color-primary)]" : "bg-white/10"}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white transition ${enabled[r.code] ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </SettingsCard>

      <SettingsCard
        icon={Globe}
        title="Restricted countries"
        description="Sign-ups and bookings are blocked from these ISO country codes."
        footer={<SaveButton onClick={() => toast.success(`Restrictions saved (${restricted.length})`)} />}
      >
        <div className="flex flex-wrap gap-1.5 mb-3">
          {restricted.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5 text-xs px-2.5 h-7 rounded-md bg-[oklch(0.65_0.23_27_/_0.12)] text-[var(--color-danger)]">
              {c}
              <button onClick={() => setRestricted(restricted.filter((x) => x !== c))} className="opacity-60 hover:opacity-100">
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            className={inputCls + " flex-1"}
            placeholder="ISO code (e.g. RU)"
            maxLength={2}
            value={newCountry}
            onChange={(e) => setNewCountry(e.target.value.toUpperCase())}
          />
          <SecondaryButton onClick={() => { if (newCountry.length === 2 && !restricted.includes(newCountry)) { setRestricted([...restricted, newCountry]); setNewCountry(""); } }}>
            <span className="inline-flex items-center gap-1"><Plus className="h-3 w-3" /> Add</span>
          </SecondaryButton>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={MapPin}
        title="Service radius"
        description="How far workers will travel for hyperlocal jobs."
        footer={<SaveButton onClick={() => toast.success("Radius defaults saved")} />}
      >
        <FieldRow label="Default radius">
          <div className="flex items-center gap-2">
            <Input className={inputCls + " w-28"} type="number" value={defaultRadius} onChange={(e) => setDefaultRadius(e.target.value)} />
            <span className="text-xs text-white/45">{unit}</span>
          </div>
        </FieldRow>
        <FieldRow label="Maximum radius">
          <div className="flex items-center gap-2">
            <Input className={inputCls + " w-28"} type="number" value={maxRadius} onChange={(e) => setMaxRadius(e.target.value)} />
            <span className="text-xs text-white/45">{unit}</span>
          </div>
        </FieldRow>
        <FieldRow label="Unit">
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className={inputCls}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="km">Kilometers</SelectItem>
              <SelectItem value="mi">Miles</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
      </SettingsCard>
    </>
  );
}
