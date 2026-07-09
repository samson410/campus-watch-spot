import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "security" | "admin";

export const ADMIN_FLAG_KEY = "campussafe_admin";

function readAdminFlag(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_FLAG_KEY) === "1";
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminFlag, setAdminFlag] = useState<boolean>(readAdminFlag());

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const onStorage = () => setAdminFlag(readAdminFlag());
    window.addEventListener("storage", onStorage);
    window.addEventListener("campussafe-admin-change", onStorage);
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("campussafe-admin-change", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .then(({ data }) => setRoles((data ?? []).map((r) => r.role as AppRole)));
  }, [user]);

  const isAdmin = adminFlag || roles.includes("admin");

  return {
    session,
    user,
    roles,
    loading,
    isAdmin,
    isSecurity: isAdmin || roles.includes("security"),
    isStudent: roles.includes("student"),
    isLocalAdmin: adminFlag,
  };
}

export function setLocalAdmin(on: boolean) {
  if (typeof window === "undefined") return;
  if (on) window.localStorage.setItem(ADMIN_FLAG_KEY, "1");
  else window.localStorage.removeItem(ADMIN_FLAG_KEY);
  window.dispatchEvent(new Event("campussafe-admin-change"));
}
