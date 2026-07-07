import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { fetchIncident } from "@/lib/incidents";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { categoryLabel, STATUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/incidents/$id")({
  head: () => ({ meta: [{ title: "Incident — CampusSafe" }] }),
  component: IncidentDetail,
});

function IncidentDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, isSecurity } = useAuth();
  const { data: incident, isLoading } = useQuery({ queryKey: ["incident", id], queryFn: () => fetchIncident(id) });
  const [comments, setComments] = useState<{ id: string; comment: string; user_id: string; created_at: string }[]>([]);
  const [newComment, setNewComment] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("comments").select("*").eq("incident_id", id).order("created_at").then(({ data }) => setComments(data ?? []));
  }, [id]);

  useEffect(() => {
    if (incident?.image_url) {
      supabase.storage.from("incident-images").createSignedUrl(incident.image_url, 3600).then(({ data }) => {
        if (data) setImgUrl(data.signedUrl);
      });
    }
  }, [incident?.image_url]);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!incident) return <p>Not found</p>;

  const updateStatus = async (status: string) => {
    const { error } = await supabase.from("incidents").update({ status: status as never, verified_by: user?.id }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    qc.invalidateQueries({ queryKey: ["incident", id] });
    qc.invalidateQueries({ queryKey: ["incidents"] });
  };

  const postComment = async () => {
    if (!newComment.trim() || !user) return;
    const { data, error } = await supabase.from("comments").insert({ incident_id: id, user_id: user.id, comment: newComment.trim() }).select().single();
    if (error) return toast.error(error.message);
    setComments((c) => [...c, data]);
    setNewComment("");
  };

  const remove = async () => {
    if (!confirm("Delete this incident?")) return;
    const { error } = await supabase.from("incidents").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["incidents"] });
    navigate({ to: "/incidents" });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle className="text-2xl">{incident.title}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{categoryLabel(incident.category)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>{incident.severity}</Badge>
              <Badge variant="outline">{incident.status}</Badge>
              {incident.is_anonymous && <Badge variant="secondary">Anonymous</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-line text-sm">{incident.description}</p>
          {imgUrl && <img src={imgUrl} alt="Incident evidence" className="max-h-96 rounded-lg border border-border" />}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {incident.location_name ?? "Unknown"} ({incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)})</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(incident.created_at), "PPp")}</span>
            {!incident.is_anonymous && <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> Reporter shown to security</span>}
          </div>
          {isSecurity && (
            <div className="flex flex-wrap items-end gap-3 border-t border-border pt-4">
              <div className="w-48 space-y-1">
                <label className="text-xs font-medium">Update status</label>
                <Select value={incident.status} onValueChange={updateStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="destructive" onClick={remove}>Delete</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Comments ({comments.length})</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <p>{c.comment}</p>
                <p className="mt-1 text-xs text-muted-foreground">{format(new Date(c.created_at), "PPp")}</p>
              </div>
            ))}
            {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment…" maxLength={500} rows={3} />
            <Button onClick={postComment} disabled={!newComment.trim()} size="sm" className="self-end">Post</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
