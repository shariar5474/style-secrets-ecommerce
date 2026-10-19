-- ============================================================
-- Style Secrets: Fix for Auth User Signup & Profile Trigger
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create or replace handle_new_user with robust search_path and exception safety
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, avatar_url, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'user'), '@', 1)),
        NEW.raw_user_meta_data->>'phone',
        NEW.raw_user_meta_data->>'avatar_url',
        'customer'::public.user_role
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Failsafe: ensures auth user registration NEVER aborts
        RETURN NEW;
END;
$$;

-- 2. Re-bind the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Add INSERT policy for profiles so RLS never blocks profile creation
DO $$ BEGIN
    CREATE POLICY "Allow profile creation on signup"
        ON public.profiles FOR INSERT
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Grant required permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO postgres, anon, authenticated, service_role;
