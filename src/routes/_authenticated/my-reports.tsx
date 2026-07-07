import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchMyIncidents } from "@/lib/incidents";
import { useAuth } from "@/hooks/useAuth";
import { IncidentCard } from "@/components/IncidentCard";

export const Route = createFileRoute("/_authenticated/my-reports")({
  head: () => ({ meta: [{ title: "My Reports — CampusSafe" }] }),
  component: MyReports,
});

function MyReports() {
  const { user } = useAuth();
  const { data = [], isLoading } = useQuery({
    queryKey: ["my-incidents", user?.id],
    queryFn: () => fetchMyIncidents(user!.id),
    enabled: !!user,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My reports</h1>
        <p className="text-sm text-muted-foreground">Track status of your submitted incidents</p>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          You haven't reported any incidents yet.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((i) => <IncidentCard key={i.id} incident={i} />)}
        </div>
      )}
    </div>
  );
}
