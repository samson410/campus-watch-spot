import { Link } from "@tanstack/react-router";
import { MapPin, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Incident } from "@/lib/incidents";
import { categoryLabel } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const sevClass: Record<string, string> = {
  emergency: "bg-destructive text-destructive-foreground",
  high: "bg-destructive/85 text-destructive-foreground",
  medium: "bg-warning text-warning-foreground",
  low: "bg-success text-success-foreground",
};
const statusClass: Record<string, string> = {
  pending: "bg-muted text-foreground",
  verified: "bg-info text-info-foreground",
  rejected: "bg-destructive/70 text-destructive-foreground",
  resolved: "bg-success text-success-foreground",
};

export function IncidentCard({ incident }: { incident: Incident }) {
  return (
    <Link
      to="/incidents/$id"
      params={{ id: incident.id }}
      className="block rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{incident.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{categoryLabel(incident.category)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge className={sevClass[incident.severity]}>{incident.severity}</Badge>
          <Badge variant="outline" className={statusClass[incident.status]}>{incident.status}</Badge>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{incident.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {incident.location_name && (
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {incident.location_name}</span>
        )}
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
        </span>
        {incident.is_anonymous && <span className="italic">Anonymous</span>}
      </div>
    </Link>
  );
}
