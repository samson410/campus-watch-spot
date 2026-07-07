import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { fetchIncidents } from "@/lib/incidents";
import { INCIDENT_CATEGORIES, SEVERITIES, STATUSES } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/map")({
  head: () => ({ meta: [{ title: "Incident Map — CampusSafe" }] }),
  component: MapPage,
});

function MapPage() {
  const { data: incidents = [] } = useQuery({ queryKey: ["incidents"], queryFn: fetchIncidents });
  const [category, setCategory] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [heat, setHeat] = useState(false);
  const [MapComp, setMapComp] = useState<null | React.ComponentType<{ incidents: typeof incidents; showHeatmap?: boolean; height?: number | string }>>(null);

  useEffect(() => {
    import("@/components/IncidentMap").then((m) => setMapComp(() => m.IncidentMap));
  }, []);

  const filtered = useMemo(() => {
    return incidents.filter((i) => {
      if (category !== "all" && i.category !== category) return false;
      if (severity !== "all" && i.severity !== severity) return false;
      if (status !== "all" && i.status !== status) return false;
      if (search && !(i.location_name ?? "").toLowerCase().includes(search.toLowerCase()) && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [incidents, category, severity, status, search]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Incident Map</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} of {incidents.length} incidents shown</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-5">
          <div className="space-y-1.5">
            <Label>Search</Label>
            <Input placeholder="Location or title…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {INCIDENT_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {SEVERITIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {STATUSES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex items-center gap-2">
              <Switch id="heat" checked={heat} onCheckedChange={setHeat} />
              <Label htmlFor="heat">Hotspot heatmap</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Live map</CardTitle></CardHeader>
        <CardContent>
          {MapComp ? <MapComp incidents={filtered} showHeatmap={heat} height={560} /> : <div className="grid h-[560px] place-items-center rounded-xl border border-border bg-muted/40 text-sm text-muted-foreground">Loading map…</div>}
        </CardContent>
      </Card>
    </div>
  );
}
