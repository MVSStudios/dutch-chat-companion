
-- Table for purchase/trade-in requests (aankoop)
CREATE TABLE public.purchase_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER,
  fuel_type TEXT,
  length_m NUMERIC,
  sleeps INTEGER,
  description TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit purchase requests"
ON public.purchase_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view purchase requests"
ON public.purchase_requests FOR SELECT
USING (true);

-- Table for montage appointments
CREATE TABLE public.montage_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  motorhome_info TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.montage_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit montage appointments"
ON public.montage_appointments FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view montage appointments"
ON public.montage_appointments FOR SELECT
USING (true);

-- Table for SEO settings per page
CREATE TABLE public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  page_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view SEO settings"
ON public.seo_settings FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage SEO settings"
ON public.seo_settings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can update SEO settings"
ON public.seo_settings FOR UPDATE
USING (true);

-- Insert default SEO entries
INSERT INTO public.seo_settings (page_slug, page_title, meta_description) VALUES
('home', 'J&C Motorhomes - Aankoop, Verkoop & Montage', 'Uw specialist in aankoop, verkoop, montage en advies van motorhomes in België.'),
('motorhomes', 'Ons Aanbod - J&C Motorhomes', 'Bekijk ons aanbod tweedehands motorhomes. Eerlijke prijzen en kwaliteit gegarandeerd.'),
('diensten', 'Onze Diensten - J&C Motorhomes', 'Montage, advies en begeleiding bij aankoop of verkoop van uw motorhome.'),
('contact', 'Contact - J&C Motorhomes', 'Neem contact op met J&C Motorhomes voor vragen, offertes of afspraken.'),
('aankoop', 'Uw Motorhome Verkopen - J&C Motorhomes', 'Wilt u uw motorhome verkopen? Vraag vrijblijvend een bod aan bij J&C Motorhomes.'),
('montage', 'Montage Afspraak - J&C Motorhomes', 'Maak een afspraak voor professionele montage van accessoires op uw motorhome.');

CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
