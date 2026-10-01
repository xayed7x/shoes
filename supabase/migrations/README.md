# Supabase Migrations

## Run order

### Fresh database (no data)

```
schema.sql               ← full schema, run once in SQL Editor
002_checkout.sql         ← add checkout columns + create_order() function
003_admin_storage.sql    ← is_admin(), profiles RLS, storage bucket + policies
```

### Existing database (already has schema.sql applied)

```
002_checkout.sql         ← if not already run
003_admin_storage.sql    ← is_admin(), profiles RLS, storage bucket + policies
```

All migration files are **idempotent** — safe to re-run (they use `CREATE OR REPLACE`, `IF NOT EXISTS`, `ON CONFLICT DO NOTHING/UPDATE`, `DROP … IF EXISTS`).

---

## After running 003_admin_storage.sql — promote the first admin

1. Go to **Supabase Dashboard → Authentication → Users → Add user**
   - Fill in email + password. Tick **"Auto Confirm User"**.

2. Open **SQL Editor** and run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = '<your-admin-email@example.com>'
);
```

3. Verify it worked:

```sql
SELECT id, email, role
FROM public.profiles
WHERE role = 'admin';
```

4. Navigate to `/admin/login`, log in with those credentials, and you will be redirected to `/admin`.

---

## Security notes

- Normal users **cannot** update their own `role` column — the RLS `WITH CHECK` on `profiles_update_own` enforces `new.role = old.role`.
- The `is_admin()` function is `SECURITY DEFINER`, so it always reads the real DB value, not whatever the client claims.
- The middleware (`src/middleware.ts`) only checks authentication (no DB read). The **authoritative** admin check happens server-side in `src/lib/auth/admin.ts → requireAdmin()` which calls `getUser()` (never `getSession()`) and reads `profiles.role`.
