import { Link } from "@tanstack/react-router";
import { Menu, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "./nav-items";

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="p-6">
        <Link to="/" onClick={onNavigate} className="mb-8 flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">AetherFlow</span>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{
                className: "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
              }}
              inactiveProps={{ className: "text-sidebar-foreground/55 hover:text-sidebar-foreground" }}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="rounded-xl bg-sidebar-foreground/5 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-sidebar-foreground/45">
            Pro Plan
          </p>
          <p className="text-xs text-sidebar-foreground/75">84% AI capacity used</p>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sidebar-foreground/10">
            <div className="h-full w-[84%] bg-sidebar-primary" />
          </div>
        </div>
        <p className="mt-6 text-[10px] leading-relaxed text-sidebar-foreground/45">
          AI-generated content may require human review.
        </p>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 md:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarContent />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface px-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="rounded-md p-2 text-muted-foreground hover:bg-muted md:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Open navigation</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 border-none p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarContent onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="truncate font-display text-base font-semibold md:text-lg">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <span className="hidden items-center gap-2 rounded-full bg-muted px-3 py-1.5 sm:flex">
              <span className="size-2 animate-pulse rounded-full bg-success" />
              <span className="text-[11px] font-medium text-muted-foreground">AI READY</span>
            </span>
          </div>
        </header>

        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
