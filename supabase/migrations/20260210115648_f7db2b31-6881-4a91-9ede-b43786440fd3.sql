
ALTER TABLE public.purchase_requests
  ADD COLUMN motor text,
  ADD COLUMN transmission text,
  ADD COLUMN first_registration text,
  ADD COLUMN horsepower integer,
  ADD COLUMN options text,
  ADD COLUMN damage text,
  ADD COLUMN immediately_available text;
