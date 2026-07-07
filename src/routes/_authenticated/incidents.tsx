import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchIncidents } from "@/lib/incidents";
import { IncidentCard } from "@/components/IncidentCard";
import { INCIDENT_CATEGORIES, SEVERITIES, STATUSES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/incidents")({
  head: () => ({ meta: [{ title: "Incident Feed — CampusSafe" }] }),
  component: Feed,
});

function Feed() {
  const { data: incidents = [], isLoading } = useQuery({ queryKey: ["incidents"], queryFn: fetchIncidents });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sev, setSev] = useState("all");
  const [st, setSt] = useState("all");

  const filtered = useMemo(() => {
    return incidents.filter((i) => {
      if (cat !== "all" && i.category !== cat) return false;
      if (sev !== "all" && i.severity !== sev) return false;
      if (st !== "all" && i.status !== st) return false;
      if (q && !`${i.title} ${i.description} ${i.location_name ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [incidents, q, cat, sev, st]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incident feed</h1>
        <p className="text-sm text-muted-foreground">Recent reports across campus</p>
      </div>

      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 md:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Search</Label>
          <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {INCIDENT_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Severity</Label>
          <Select value={sev} onValueChange={setSev}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {SEVERITIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={st} onValueChange={setSt}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No incidents match your filters.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((i) => <IncidentCard key={i.id} incident={i} />)}
        </div>
      )}
    </div>
  );
}
