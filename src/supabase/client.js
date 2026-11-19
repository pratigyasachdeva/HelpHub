import { createClient } from '@supabase/supabase-js';
import { auth } from '../firebase/config';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey, {
      accessToken: async () => auth.currentUser?.getIdToken() ?? null,
    })
  : null;
