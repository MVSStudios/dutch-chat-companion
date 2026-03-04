
-- User permissions table
CREATE TABLE public.user_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  can_view_motorhomes boolean NOT NULL DEFAULT true,
  can_view_quotes boolean NOT NULL DEFAULT true,
  can_view_messages boolean NOT NULL DEFAULT true,
  can_view_purchases boolean NOT NULL DEFAULT true,
  can_view_montage boolean NOT NULL DEFAULT true,
  can_view_seo boolean NOT NULL DEFAULT true,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage permissions
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_permissions
    WHERE user_id = _user_id AND is_admin = true
  )
$$;

CREATE POLICY "Admins can view all permissions"
  ON public.user_permissions FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert permissions"
  ON public.user_permissions FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update permissions"
  ON public.user_permissions FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete permissions"
  ON public.user_permissions FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- Users can read their own permissions
CREATE POLICY "Users can view own permissions"
  ON public.user_permissions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Password reset requests table
CREATE TABLE public.password_reset_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  handled_at timestamp with time zone
);

ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (from login page)
CREATE POLICY "Anyone can submit password reset"
  ON public.password_reset_requests FOR INSERT
  WITH CHECK (true);

-- Only admins can view/update
CREATE POLICY "Admins can view reset requests"
  ON public.password_reset_requests FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update reset requests"
  ON public.password_reset_requests FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete reset requests"
  ON public.password_reset_requests FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));
