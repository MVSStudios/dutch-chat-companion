
-- Add images column to purchase_requests
ALTER TABLE public.purchase_requests ADD COLUMN images text[] DEFAULT NULL;

-- Create storage bucket for purchase request images (public so users can upload without auth)
INSERT INTO storage.buckets (id, name, public) VALUES ('purchase-request-images', 'purchase-request-images', true);

-- Allow anyone to upload to the bucket
CREATE POLICY "Anyone can upload purchase images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'purchase-request-images');

-- Allow anyone to read from the bucket
CREATE POLICY "Anyone can view purchase images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'purchase-request-images');
