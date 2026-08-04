import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Shield, LayoutDashboard, Map as MapIcon, FileText, Plus, ClipboardList,
  ShieldCheck, Users, LogOut, Menu, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { ThemeToggle } from "@/components/ThemeToggle";


type NavItem = { to: string; label: string; icon: typeof Shield; show?: boolean };

export function AppShell({ children }: { children: ReactNode }) {
  const { user, isSecurity, isAdmin, isLocalAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items: NavItem[] = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: !isLocalAdmin },
    { to: "/map", label: "Incident Map", icon: MapIcon, show: !isLocalAdmin },
    { to: "/incidents", label: "Incident Feed", icon: FileText, show: !isLocalAdmin },
    { to: "/report", label: "Report Incident", icon: Plus, show: !isLocalAdmin },
    { to: "/my-reports", label: "My Reports", icon: ClipboardList, show: !isLocalAdmin },
    { to: "/security", label: "Security Console", icon: ShieldCheck, show: isSecurity && !isLocalAdmin },
    { to: "/admin", label: "Admin", icon: Users, show: isAdmin },
  ].filter((i) => i.show !== false);

  const handleSignOut = async () => {
    const { setLocalAdmin } = await import("@/hooks/useAuth");
    setLocalAdmin(false);
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const SidebarInner = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
          <Shield className="h-4 w-4" />
        </span>

        <span className="font-semibold tracking-tight">CampusSafe</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="mb-2 truncate px-2 text-xs text-sidebar-foreground/60">
          {isLocalAdmin ? "admin (local)" : user?.email}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 md:block">{SidebarInner}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "var(--overlay)" }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 shadow-2xl">{SidebarInner}</div>
        </div>
      )}


      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex-1" />
          <ThemeToggle />
          <span className="hidden truncate text-sm text-muted-foreground sm:block">
            {isLocalAdmin ? "admin (local)" : user?.email}
          </span>

        </header>
        <EmergencyBanner />
        <main className="min-w-0 flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
