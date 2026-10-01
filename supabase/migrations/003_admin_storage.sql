-- ============================================================
-- 003_admin_storage.sql
-- Admin storage bucket + policies, profile guard, is_admin()
-- Safe to run on an existing database (all statements are idempotent).
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1.  is_admin() helper function
--     Used by RLS policies to check caller role.
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id   = auth.uid()
      AND role = 'admin'
  );
$$;

-- Revoke direct execute from public; only the internal RLS engine uses it.
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO service_role;


-- ──────────────────────────────────────────────────────────
-- 2.  Profile auto-creation trigger
--     Ensures a public.profiles row is created for every new
--     auth.users row so requireAdmin() can always read it.
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'            -- always 'customer' on signup
  )
  ON CONFLICT (id) DO NOTHING;  -- idempotent
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger so this migration is re-runnable.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ──────────────────────────────────────────────────────────
-- 3.  RLS on public.profiles
--     Users can read/update their own row but CANNOT change
--     the `role` column.  Only service_role (used via Supabase
--     Dashboard SQL editor) can promote a user to admin.
-- ──────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile.
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to read all profiles (needed for admin panel).
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

-- Allow users to update their own profile — but NOT the role column.
-- We achieve this with a column-level check: the new role must equal
-- the old role (i.e., the user cannot change it).
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING  (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid())
  );

-- Admins can update any profile (needed to update role via admin panel later).
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_update_admin"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin());


-- ──────────────────────────────────────────────────────────
-- 4.  Public storage bucket: product-images
-- ──────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;   -- idempotent


-- ──────────────────────────────────────────────────────────
-- 5.  Storage policies on storage.objects
-- ──────────────────────────────────────────────────────────

-- Anyone (including anonymous) can view images.
DROP POLICY IF EXISTS "product_images_public_select" ON storage.objects;
CREATE POLICY "product_images_public_select"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');

-- Only admins can upload images.
DROP POLICY IF EXISTS "product_images_admin_insert" ON storage.objects;
CREATE POLICY "product_images_admin_insert"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Only admins can update/replace images.
DROP POLICY IF EXISTS "product_images_admin_update" ON storage.objects;
CREATE POLICY "product_images_admin_update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );

-- Only admins can delete images.
DROP POLICY IF EXISTS "product_images_admin_delete" ON storage.objects;
CREATE POLICY "product_images_admin_delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND public.is_admin()
  );


-- ============================================================
-- HOW TO PROMOTE THE FIRST ADMIN USER
-- ============================================================
-- 1. Create the user in Supabase Dashboard → Authentication → Users → "Add user".
--    (Use "Auto Confirm User" so they can log in immediately.)
--
-- 2. Run this SQL in the Supabase SQL Editor (replace the email):
--
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE id = (
--      SELECT id FROM auth.users WHERE email = '<your-admin-email@example.com>'
--    );
--
-- 3. Verify:
--    SELECT id, email, role FROM public.profiles
--    WHERE role = 'admin';
-- ============================================================
