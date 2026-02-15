
CREATE POLICY "Authenticated users can delete contact messages"
ON public.contact_messages FOR DELETE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete montage appointments"
ON public.montage_appointments FOR DELETE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete purchase requests"
ON public.purchase_requests FOR DELETE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete quote requests"
ON public.quote_requests FOR DELETE
USING (auth.uid() IS NOT NULL);
