import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function getSessionUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

import type { Profile } from "@/types/database";

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export async function getUserRole(): Promise<UserRole | null> {
  const profile = await getProfile();
  return profile?.role ?? null;
}
