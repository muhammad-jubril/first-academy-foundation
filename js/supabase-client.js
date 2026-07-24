// ============================================================
// Shared Supabase connection settings.
// The URL + publishable key below are SAFE to expose in public
// code — they only grant the access levels defined by the RLS
// policies in sql/setup.sql (public = read published posts only).
// Real security comes from the admin login, not from hiding these.
// ============================================================

const SUPABASE_URL = "https://annmbmuuiqvutgvvkpet.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mIdKFw3AN-zBY0uHGSovOg_TmzZ_jsO";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
