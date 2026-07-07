
-- Fix search_path warnings
ALTER FUNCTION public.tg_set_updated_at() SET search_path = public;

-- Restrict SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Storage policies for incident-images bucket
CREATE POLICY "Authenticated can view incident images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'incident-images');
CREATE POLICY "Users upload incident images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'incident-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users delete own images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'incident-images' AND auth.uid()::text = (storage.foldername(name))[1]);
