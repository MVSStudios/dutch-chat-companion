
-- Create motorhomes table
CREATE TABLE public.motorhomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  year INTEGER,
  brand TEXT,
  model TEXT,
  mileage INTEGER,
  fuel_type TEXT,
  length_m NUMERIC,
  sleeps INTEGER,
  features TEXT[],
  images TEXT[],
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.motorhomes ENABLE ROW LEVEL SECURITY;

-- Public can view available motorhomes
CREATE POLICY "Anyone can view motorhomes"
  ON public.motorhomes
  FOR SELECT
  USING (true);

-- Only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert motorhomes"
  ON public.motorhomes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update motorhomes"
  ON public.motorhomes
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete motorhomes"
  ON public.motorhomes
  FOR DELETE
  TO authenticated
  USING (true);

-- Create quote requests table
CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  motorhome_id UUID REFERENCES public.motorhomes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a quote request
CREATE POLICY "Anyone can submit quote requests"
  ON public.quote_requests
  FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can view quote requests
CREATE POLICY "Authenticated users can view quote requests"
  ON public.quote_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_motorhomes_updated_at
  BEFORE UPDATE ON public.motorhomes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for motorhome images
INSERT INTO storage.buckets (id, name, public) VALUES ('motorhome-images', 'motorhome-images', true);

CREATE POLICY "Anyone can view motorhome images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'motorhome-images');

CREATE POLICY "Authenticated users can upload motorhome images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'motorhome-images');

CREATE POLICY "Authenticated users can update motorhome images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'motorhome-images');

CREATE POLICY "Authenticated users can delete motorhome images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'motorhome-images');
