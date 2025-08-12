-- Create user roles table for admin functionality
CREATE TYPE public.user_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update facilities table to allow admin operations
CREATE POLICY "Admins can manage all facilities"
  ON public.facilities
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for facility images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('facility-images', 'facility-images', true);

-- Storage policies for facility images
CREATE POLICY "Public can view facility images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'facility-images');

CREATE POLICY "Admins can upload facility images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'facility-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update facility images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'facility-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete facility images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'facility-images' AND public.has_role(auth.uid(), 'admin'));