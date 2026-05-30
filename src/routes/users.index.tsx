import { createFileRoute } from "@tanstack/react-router";
import { TableSkeleton } from "@/components/admin/PageSkeletons";
import { UsersPage } from "./users";

export const Route = createFileRoute("/users/")({
  loader: async () => {
    await new Promise((r) => setTimeout(r, 380));
    return null;
  },
  pendingMs: 0,
  pendingMinMs: 400,
  pendingComponent: () => <TableSkeleton eyebrow="Identity" stats={4} rows={9} cols={7} />,
  head: () => ({ meta: [{ title: "Users — Nexora" }] }),
  component: UsersPage,
});