import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ADMIN_PASS = "admin123";

const authInput = z.object({ pass: z.string() });

export const adminListUsers = createServerFn({ method: "GET" })
  .inputValidator((d) => authInput.parse(d))
  .handler(async ({ data }) => {
    if (data.pass !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*").order("created_at", { ascending: false }),
      supabaseAdmin.from("user_roles").select("*"),
    ]);
    return { profiles: profiles ?? [], roles: roles ?? [] };
  });

export const adminSetRole = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    authInput.extend({
      userId: z.string().uuid(),
      role: z.enum(["student", "security", "admin"]),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    if (data.pass !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListIncidents = createServerFn({ method: "GET" })
  .inputValidator((d) => authInput.parse(d))
  .handler(async ({ data }) => {
    if (data.pass !== ADMIN_PASS) throw new Error("Unauthorized");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin.from("incidents").select("*");
    return rows ?? [];
  });
