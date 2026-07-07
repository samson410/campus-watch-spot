import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";

export function EmergencyBanner() {
  const [emergencies, setEmergencies] = useState<{ id: string; title: string }[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const cutoff = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    supabase
      .from("incidents")
      .select("id,title")
      .eq("severity", "emergency")
      .neq("status", "resolved")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setEmergencies(data ?? []));

    const channel = supabase
      .channel("emergency-banner")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "incidents", filter: "severity=eq.emergency" },
        (payload) => {
          const row = payload.new as { id: string; title: string };
          setEmergencies((prev) => [{ id: row.id, title: row.title }, ...prev].slice(0, 3));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const visible = emergencies.filter((e) => !dismissed.has(e.id));
  if (!visible.length) return null;

  return (
    <div className="border-b border-destructive/40 bg-destructive/10">
      {visible.map((e) => (
        <div key={e.id} className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          <span className="min-w-0 truncate">
            <span className="font-semibold text-destructive">EMERGENCY:</span>{" "}
            <Link to="/incidents/$id" params={{ id: e.id }} className="underline underline-offset-2">
              {e.title}
            </Link>
          </span>
          <button
            className="ml-auto shrink-0 rounded p-1 text-destructive hover:bg-destructive/20"
            onClick={() => setDismissed((s) => new Set(s).add(e.id))}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
