import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Incident = Database["public"]["Tables"]["incidents"]["Row"];

export async function fetchIncidents(): Promise<Incident[]> {
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return data ?? [];
}

export async function fetchIncident(id: string): Promise<Incident | null> {
  const { data, error } = await supabase.from("incidents").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMyIncidents(userId: string): Promise<Incident[]> {
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
