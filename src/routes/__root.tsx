import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { TopBar } from "@/components/admin/TopBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Page not found</h2>
        <p className="mt-2 text-sm text-white/55">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--gradient-primary)" }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-white">This page didn't load</h1>
        <p className="mt-2 text-sm text-white/55">{error.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--gradient-primary)" }}
          >Try again</button>
          <a href="/" className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nexora — Super Admin Control Center" },
      { name: "description", content: "Real-time operations console for the Nexora hyperlocal micro-job marketplace." },
      { name: "author", content: "Nexora" },
      { property: "og:title", content: "Nexora — Super Admin Control Center" },
      { property: "og:description", content: "Premium real-time admin dashboard for workers, jobs, payments, and verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen w-full text-white">
        <AppSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <TopBar />
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  );
}
