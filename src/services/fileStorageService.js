import { isSupabaseConfigured, supabase } from '../supabase/client';

const RESOURCE_BUCKET = 'resource-pdfs';
const AVATAR_BUCKET = 'avatars';

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('File storage is not set up yet. Add the Supabase URL and publishable key to .env.');
  }
  return supabase;
}

function safeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function uploadResourcePdf(uid, file) {
  const client = requireSupabase();
  const path = `${uid}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await client.storage.from(RESOURCE_BUCKET).upload(path, file, {
    contentType: 'application/pdf',
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function getResourcePdfUrl(path) {
  const client = requireSupabase();
  const { data, error } = await client.storage
    .from(RESOURCE_BUCKET)
    .createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function removeResourcePdf(path) {
  if (!path) return;
  const client = requireSupabase();
  const { error } = await client.storage.from(RESOURCE_BUCKET).remove([path]);
  if (error) throw error;
}

export async function uploadAvatar(uid, file) {
  const client = requireSupabase();
  const path = `${uid}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error } = await client.storage.from(AVATAR_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  const { data } = client.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
