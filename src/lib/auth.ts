import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/types/database";

export type SessionProfile = Pick<ProfileRow, "id" | "role" | "full_name">;

export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", user.id)
    .single();

  return profile;
}

export function canAccessBackOffice(role: ProfileRow["role"] | undefined): boolean {
  return role === "moderateur" || role === "administrateur";
}
