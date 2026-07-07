## CampusSafe — Build Plan

A responsive incident reporting & mapping platform for university campuses, powered by Lovable Cloud (Postgres + Auth + Storage) with a Leaflet map, Recharts analytics, and role-based dashboards.

### Design direction
- Modern university-security theme: navy/blue primary, white/gray surfaces, red/orange alert accents, green for resolved.
- Light + dark mode, mobile-first, accessible (semantic HTML, focus states, ARIA).
- Clean dashboard shell with sidebar nav on desktop, bottom-nav/drawer on mobile.
- Semantic tokens defined in `src/styles.css` (oklch); shadcn variants only — no hardcoded colors.

### Tech
- TanStack Start + React + TS + Tailwind v4 + shadcn/ui (already scaffolded).
- Lovable Cloud (Supabase) for DB, Auth (email/password + Google), Storage.
- Leaflet + react-leaflet + leaflet.heat for map + hotspots.
- Recharts for analytics.

### Data model (public schema, RLS + GRANTs)
- `profiles` — id (FK auth.users), full_name, email, hostel, created_at
- `user_roles` — enum `app_role` (`student`, `security`, `admin`); `has_role()` SECURITY DEFINER
- `incidents` — id, user_id, title, category (enum), description, severity (low/medium/high/emergency), latitude, longitude, location_name, image_url, status (pending/verified/rejected/resolved), is_anonymous, verified_by, created_at
- `comments` — id, incident_id, user_id, comment, created_at
- Storage bucket `incident-images` (public read).
- Signup trigger creates profile + default `student` role.
- Realtime enabled on `incidents` for live map/feed updates.

### Routes
Public
- `/` Landing (hero, features, how-it-works, CTA)
- `/about`, `/contact`
- `/auth` (login + signup tabs, Google)
- `/reset-password`

Authenticated (`_authenticated/`)
- `/dashboard` — role-aware home
- `/map` — interactive incident map + filters + heatmap
- `/report` — new incident form (with GPS pick, image upload, anonymous toggle)
- `/incidents` — feed with filter chips
- `/incidents/$id` — detail + comments + status
- `/my-reports` — student's own reports
- Security-only: `/security` dashboard (widgets + charts + verify queue)
- Admin-only: `/admin` (users, roles, activity, export CSV)

### Key features
- Emergency banner: subscribes to realtime `incidents` where severity=emergency & created in last 30 min.
- Marker colors: red=high, orange=medium, green=resolved, blue=verified.
- Filters: type, date range, status, severity; search by location name.
- Heatmap layer toggle on map.
- Charts: incidents by category (bar), by month (line), by location (bar), resolution rate (donut).
- Role protection via `_authenticated` gate + `has_role()` checks; UI hides unauthorized nav.
- Seed migration inserts ~20 realistic sample incidents around a demo campus.

### Technical notes
- Server functions in `src/lib/*.functions.ts` for mutations (`requireSupabaseAuth`).
- Public listing uses server publishable client with narrow `TO anon` SELECT policy on non-sensitive incident fields (for landing stats only); authenticated reads via browser client.
- Leaflet loaded client-only (`<ClientOnly>` / dynamic import) to avoid SSR window errors.
- `sitemap.xml` + `robots.txt`.

### Deliverables this build
1. Enable Lovable Cloud, run migration (schema + RLS + GRANTs + trigger + seed).
2. Create storage bucket + policies.
3. Design system tokens in `src/styles.css`.
4. Auth flow + role-based route guards.
5. All routes above with responsive shell, dark mode toggle.
6. Leaflet map + heatmap + filters.
7. Report form with image upload + optional GPS.
8. Security + Admin dashboards with Recharts.
9. Emergency alert banner via realtime.
10. Landing/About/Contact pages with SEO metadata.

Approve to proceed and I'll build it end-to-end.