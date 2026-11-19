-- Create these buckets first in the Supabase Dashboard:
--   resource-pdfs: private
--   avatars: public
--
-- Firebase Auth ID tokens are trusted through Supabase's Firebase third-party
-- auth integration. Firebase tokens have no `role` claim by default, so these
-- narrowly-scoped policies target `anon` and require the expected issuer,
-- audience, and (for uploads/deletes) a user-owned folder. Requests using only
-- the Supabase publishable key do not satisfy those checks.

create policy "Firebase users can upload PDFs to their own folder"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'resource-pdfs'
  and auth.jwt() ->> 'iss' = 'https://securetoken.google.com/helphub-platform'
  and auth.jwt() ->> 'aud' = 'helphub-platform'
  and (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

create policy "Firebase users can read shared PDFs"
on storage.objects
for select
to anon
using (
  bucket_id = 'resource-pdfs'
  and auth.jwt() ->> 'iss' = 'https://securetoken.google.com/helphub-platform'
  and auth.jwt() ->> 'aud' = 'helphub-platform'
  and auth.jwt() ->> 'sub' is not null
);

create policy "Firebase users can delete their own PDFs"
on storage.objects
for delete
to anon
using (
  bucket_id = 'resource-pdfs'
  and auth.jwt() ->> 'iss' = 'https://securetoken.google.com/helphub-platform'
  and auth.jwt() ->> 'aud' = 'helphub-platform'
  and (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);

create policy "Firebase users can upload avatars to their own folder"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'avatars'
  and auth.jwt() ->> 'iss' = 'https://securetoken.google.com/helphub-platform'
  and auth.jwt() ->> 'aud' = 'helphub-platform'
  and (storage.foldername(name))[1] = auth.jwt() ->> 'sub'
);
