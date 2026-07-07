import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — CampusSafe" }] }),
  component: AdminPage,
});

type UserRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  hostel: string | null;
  created_at: string;
  roles: string[];
};

function AdminPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    const byUser = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const arr = byUser.get(r.user_id) ?? [];
      arr.push(r.role);
      byUser.set(r.user_id, arr);
    });
    setUsers(
      (profiles ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        hostel: p.hostel,
        created_at: p.created_at,
        roles: byUser.get(p.id) ?? [],
      })),
    );
    setLoading(false);
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const setRole = async (userId: string, role: "student" | "security" | "admin") => {
    const { error } = await supabase.from("user_roles").upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`);
    load();
  };

  const exportCsv = async () => {
    const { data } = await supabase.from("incidents").select("*");
    const rows = data ?? [];
    const headers = Object.keys(rows[0] ?? {});
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => JSON.stringify((r as never)[h] ?? "")).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incidents-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAdmin) {
    return <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Admins only.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">Manage users and export incident data</p>
        </div>
        <Button onClick={exportCsv} variant="outline">Export incidents CSV</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Users & roles</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr className="border-b border-border">
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Hostel</th>
                    <th className="py-2 pr-3">Roles</th>
                    <th className="py-2 pr-3">Grant</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border/60">
                      <td className="py-2 pr-3">{u.full_name ?? "—"}</td>
                      <td className="py-2 pr-3">{u.email ?? "—"}</td>
                      <td className="py-2 pr-3">{u.hostel ?? "—"}</td>
                      <td className="py-2 pr-3 space-x-1">
                        {u.roles.map((r) => <Badge key={r} variant="secondary">{r}</Badge>)}
                      </td>
                      <td className="py-2 pr-3">
                        <Select onValueChange={(v) => setRole(u.id, v as never)}>
                          <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Add role" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">student</SelectItem>
                            <SelectItem value="security">security</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
