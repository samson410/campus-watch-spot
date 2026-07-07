import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchIncidents } from "@/lib/incidents";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IncidentCard } from "@/components/IncidentCard";
import { categoryLabel, INCIDENT_CATEGORIES } from "@/lib/constants";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/security")({
  head: () => ({ meta: [{ title: "Security Console — CampusSafe" }] }),
  component: SecurityPage,
});

const COLORS = ["#dc2626", "#ea580c", "#f59e0b", "#2563eb", "#16a34a", "#7c3aed", "#0891b2", "#6b7280"];

function SecurityPage() {
  const { isSecurity } = useAuth();
  const { data: incidents = [] } = useQuery({ queryKey: ["incidents"], queryFn: fetchIncidents });

  const byCat = useMemo(() => {
    const m = new Map<string, number>();
    incidents.forEach((i) => m.set(i.category, (m.get(i.category) ?? 0) + 1));
    return INCIDENT_CATEGORIES.map((c) => ({ name: c.label, value: m.get(c.value) ?? 0 })).filter((x) => x.value);
  }, [incidents]);

  const byMonth = useMemo(() => {
    const m = new Map<string, number>();
    incidents.forEach((i) => {
      const key = format(new Date(i.created_at), "MMM yyyy");
      m.set(key, (m.get(key) ?? 0) + 1);
    });
    return Array.from(m.entries()).map(([name, value]) => ({ name, value }));
  }, [incidents]);

  const byLocation = useMemo(() => {
    const m = new Map<string, number>();
    incidents.forEach((i) => m.set(i.location_name ?? "Unknown", (m.get(i.location_name ?? "Unknown") ?? 0) + 1));
    return Array.from(m.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [incidents]);

  const pending = incidents.filter((i) => i.status === "pending").slice(0, 6);

  if (!isSecurity) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        This area is for security officers.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Console</h1>
        <p className="text-sm text-muted-foreground">Verify, resolve and analyze incidents</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Incidents by category</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCat}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Incidents by month</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byMonth}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Top locations</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLocation} layout="vertical">
                <XAxis type="number" fontSize={11} />
                <YAxis type="category" dataKey="name" fontSize={11} width={110} />
                <Tooltip />
                <Bar dataKey="value" fill="#ea580c" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Category share</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCat} dataKey="value" nameKey="name" outerRadius={90} label>
                  {byCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Verify queue</CardTitle></CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">All caught up — no pending reports.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {pending.map((i) => <IncidentCard key={i.id} incident={i} />)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
