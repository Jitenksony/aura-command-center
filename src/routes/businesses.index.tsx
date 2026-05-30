import { createFileRoute } from "@tanstack/react-router";
import { CardGridSkeleton } from "@/components/admin/PageSkeletons";
import { BusinessesPage } from "./businesses";

export const Route = createFileRoute("/businesses/")({
  loader: async () => {
    await new Promise((r) => setTimeout(r, 380));
    return null;
  },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => <CardGridSkeleton eyebrow="Demand" count={9} />,
  head: () => ({ meta: [{ title: "Businesses — Nexora" }] }),
  component: BusinessesPage,
});