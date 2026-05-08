import { createFileRoute } from "@tanstack/react-router";
import { SplitSkeleton } from "@/components/admin/PageSkeletons";
import { PageShell, StatTile } from "@/components/admin/PageShell";
import { VerificationPanel } from "@/components/admin/VerificationPanel";

export const Route = createFileRoute("/verification")({
  loader: async () => { await new Promise((r) => setTimeout(r, 380)); return null; },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => (<SplitSkeleton {...{ eyebrow: "Verification" }} />),
  head: () => ({ meta: [{ title: "Verification Center — Nexora" }] }),
  component: VerificationPage,
});

function VerificationPage() {
  return (
    <PageShell
      eyebrow="Trust & Safety"
      title="Verification Center"
      description="KYC review queue with AI face match, liveness detection, and document quality scoring."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile label="Pending Review" value="324" accent="var(--color-warning)" />
        <StatTile label="Approved · 24h" value="148" accent="var(--color-success)" />
        <StatTile label="Rejected · 24h" value="22" accent="var(--color-danger)" />
        <StatTile label="Avg processing" value="6m 42s" accent="var(--color-cyan)" />
      </div>

      <VerificationPanel />
    </PageShell>
  );
}
