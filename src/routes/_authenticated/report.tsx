import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { INCIDENT_CATEGORIES, SEVERITIES, CAMPUS_CENTER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/report")({
  head: () => ({ meta: [{ title: "Report Incident — CampusSafe" }] }),
  component: ReportPage,
});

function ReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("theft");
  const [severity, setSeverity] = useState<string>("medium");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState<number>(CAMPUS_CENTER[0]);
  const [lng, setLng] = useState<number>(CAMPUS_CENTER[1]);
  const [anon, setAnon] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const useGps = () => {
    if (!navigator.geolocation) return toast.error("Geolocation not supported");
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setGpsLoading(false);
        toast.success("Location captured");
      },
      () => {
        setGpsLoading(false);
        toast.error("Could not get your location");
      },
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    let image_url: string | null = null;
    if (file) {
      const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("incident-images").upload(path, file);
      if (upErr) {
        setSubmitting(false);
        return toast.error(`Image upload failed: ${upErr.message}`);
      }
      image_url = path;
    }
    const { data, error } = await supabase
      .from("incidents")
      .insert({
        user_id: user.id,
        title: title.trim(),
        category: category as never,
        severity: severity as never,
        description: description.trim(),
        latitude: lat,
        longitude: lng,
        location_name: locationName || null,
        is_anonymous: anon,
        image_url,
        status: "pending",
      })
      .select("id")
      .single();
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Incident reported");
    navigate({ to: "/incidents/$id", params: { id: data.id } });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Report an incident</h1>
        <p className="text-sm text-muted-foreground">Your report helps keep the campus safe. Submit anonymously if you prefer.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Incident details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120} placeholder="e.g. Laptop stolen in library" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INCIDENT_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEVERITIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={2000} rows={5} placeholder="What happened, when, who was involved…" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="loc">Location name</Label>
              <Input id="loc" value={locationName} onChange={(e) => setLocationName(e.target.value)} maxLength={120} placeholder="e.g. Hostel B, Room 204" />
            </div>
            <div className="space-y-1.5">
              <Label>Latitude</Label>
              <Input type="number" step="any" value={lat} onChange={(e) => setLat(parseFloat(e.target.value))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Longitude</Label>
              <Input type="number" step="any" value={lng} onChange={(e) => setLng(parseFloat(e.target.value))} required />
            </div>
            <div className="md:col-span-2">
              <Button type="button" variant="outline" onClick={useGps} disabled={gpsLoading} size="sm">
                {gpsLoading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <MapPin className="mr-1.5 h-3.5 w-3.5" />}
                Use my current location
              </Button>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="file">Photo evidence (optional)</Label>
              <Input id="file" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Switch id="anon" checked={anon} onCheckedChange={setAnon} />
              <Label htmlFor="anon">Submit anonymously</Label>
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={submitting} size="lg" className="w-full sm:w-auto">
                {submitting ? "Submitting…" : "Submit report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
