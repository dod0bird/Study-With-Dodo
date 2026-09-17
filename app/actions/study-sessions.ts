"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { studySessionSchema } from "@/lib/validation/study-session";

export async function createStudySession(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = studySessionSchema.safeParse({
    course_id: formData.get("course_id"),
    start_at: formData.get("start_at"),
    duration_minutes: formData.get("duration_minutes"),
    focus_rating: formData.get("focus_rating"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    redirect(`/?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { error } = await supabase.from("study_sessions").insert({
    course_id: parsed.data.course_id,
    start_at: new Date(parsed.data.start_at).toISOString(),
    duration_minutes: parsed.data.duration_minutes,
    focus_rating: parsed.data.focus_rating ?? null,
    notes: parsed.data.notes || null,
    user_id: user.id,
  });

  if (error) {
    redirect(`/?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
}