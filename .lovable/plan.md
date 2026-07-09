## Goal
Simplify auth: no email verification for signup, and replace the DB-backed admin role system with a fixed hardcoded admin login (`admin` / `admin123`).

## Changes

### 1. Disable email verification
- Call `supabase--configure_auth` with `auto_confirm_email: true` so signups are instantly usable (no confirmation email, no click-through).
- Keep the existing email/password + Google flows on `/auth` as-is otherwise.
- Remove the "Forgot password?" link and `/reset-password` route (not needed for a simple demo).

### 2. Fixed admin login
- Add a small "Admin" tab (or link) on `/auth` that shows a username + password form.
- On submit, check `username === "admin" && password === "admin123"` client-side. If it matches, set a flag in `localStorage` (e.g. `campussafe_admin = "1"`) and navigate to `/admin`.
- Update `useAuth` to expose `isAdmin = true` when that localStorage flag is set (in addition to, or instead of, the DB role check).
- Update `/_authenticated/route.tsx` and `/_authenticated/admin.tsx` gates so the admin flag alone grants access to `/admin` (no Supabase session required for the admin shortcut).
- Add a "Sign out" action for the admin that clears the flag.

### 3. Cleanup
- Remove the `/reset-password` route file and the reset button on `/auth`.
- Leave the `user_roles` table in place (still used for `security` role and student defaults) but stop relying on it for admin access.

## Security note
Hardcoding `admin`/`admin123` in the client bundle means anyone who views the source can become admin. That's fine for a demo/MVP but should not be used in production — I'll add a short comment in the code flagging this.

## Files touched
- `src/routes/auth.tsx` — add Admin tab, remove reset link
- `src/hooks/useAuth.ts` — read admin flag from localStorage
- `src/routes/_authenticated/route.tsx` — allow admin flag to bypass Supabase gate for `/admin`
- `src/routes/_authenticated/admin.tsx` — add sign-out button, use flag
- `src/components/layout/AppShell.tsx` — show/hide admin link + sign-out based on flag
- Delete `src/routes/reset-password.tsx`
- Supabase auth config → auto-confirm on
