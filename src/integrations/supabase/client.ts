import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://iknstvfrjqsvqpkriqvl.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbnN0dmZyanFzdnFwa3JpcXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDY3ODcsImV4cCI6MjEwMjI4Mjc4N30.FxUnkgnJQKoWNmRe6_hAWnGfI3hNmp27X_-1F0ztGoM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
