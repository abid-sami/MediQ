// Supabase Edge Function: admin-create-user
//
// Creates an auth user AND their profile row in one server-side call using
// the service role key, so it isn't limited by client-side RLS at all.
// Deploy with: supabase functions deploy admin-create-user
// Set secrets with: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// This client has full DB access and bypasses RLS. Never expose this key
// to the browser, only use it inside this function.
const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

Deno.serve(async (req) => {
  try {
    // 1. Verify the caller is a logged-in admin before doing anything.
    const authHeader = req.headers.get("Authorization") || "";
    const callerToken = authHeader.replace("Bearer ", "");

    const { data: callerData, error: callerError } =
      await adminClient.auth.getUser(callerToken);

    if (callerError || !callerData?.user) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: callerProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", callerData.user.id)
      .single();

    if (!callerProfile || !["Admin", "Super Admin"].includes(callerProfile.role)) {
      return new Response(
        JSON.stringify({ error: "Not authorized to create users" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Parse the new user's details from the request body.
    const { name, email, phone, role, password, bloodGroup, address } =
      await req.json();

    if (!name || !email || !password || !role) {
      return new Response(
        JSON.stringify({ error: "name, email, password and role are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Create the auth user directly (no email confirmation needed,
    //    since an admin is vouching for this account).
    const { data: authData, error: authError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, phone, role },
      });

    if (authError || !authData?.user) {
      return new Response(
        JSON.stringify({ error: authError?.message || "Failed to create auth user" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Insert the profile row. Service role bypasses RLS, so this
    //    always succeeds regardless of who the "id" belongs to.
    const { error: profileError } = await adminClient.from("profiles").upsert({
      id: authData.user.id,
      name,
      email,
      phone,
      role,
      blood_group: bloodGroup || null,
      address: address || "",
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      // Roll back the auth user so we don't end up with an orphaned account
      await adminClient.auth.admin.deleteUser(authData.user.id);
      return new Response(
        JSON.stringify({ error: profileError.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ user: authData.user }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
