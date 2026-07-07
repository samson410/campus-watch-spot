import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchIncidents } from "@/lib/incidents";
import { IncidentCard } from "@/components/IncidentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CampusSafe" }] }),
  component: Dashboard,
});

function StatCard({ icon: Icon, label, value, tone }: { icon: typeof AlertTriangle; label: string; value: number; tone: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`grid h-11 w-11 place-items-center rounded-lg ${tone}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-2xl font-bold leading-none">{value}</div>
          <div className="mt-1 text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const { user, isSecurity } = useAuth();
  const { data: incidents = [], isLoading } = useQuery({ queryKey: ["incidents"], queryFn: fetchIncidents });

  const total = incidents.length;
  const pending = incidents.filter((i) => i.status === "pending").length;
  const verified = incidents.filter((i) => i.status === "verified").length;
  const resolved = incidents.filter((i) => i.status === "resolved").length;
  const emergencies = incidents.filter((i) => i.severity === "emergency" && i.status !== "resolved").length;

  const latest = incidents.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Button asChild>
          <Link to="/report"><Plus className="mr-1.5 h-4 w-4" /> Report Incident</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard icon={ShieldAlert} label="Total Incidents" value={total} tone="bg-primary/10 text-primary" />
        <StatCard icon={Clock} label="Pending" value={pending} tone="bg-warning/15 text-warning-foreground" />
        <StatCard icon={CheckCircle2} label="Verified" value={verified} tone="bg-info/15 text-info" />
        <StatCard icon={CheckCircle2} label="Resolved" value={resolved} tone="bg-success/15 text-success" />
        <StatCard icon={AlertTriangle} label="Active Emergencies" value={emergencies} tone="bg-destructive/15 text-destructive" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Latest incidents</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/incidents">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {latest.map((i) => (
                <IncidentCard key={i.id} incident={i} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {isSecurity && (
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium">You have security officer access</p>
              <p className="text-xs text-muted-foreground">Go to the console to verify and resolve incidents.</p>
            </div>
            <Button asChild variant="secondary" size="sm">
              <Link to="/security">Open console</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
