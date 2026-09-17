"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { assignmentSchema } from "@/lib/validation/assignment";

export async function createAssignment(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = assignmentSchema.safeParse({
    course_id: formData.get("course_id"),
    title: formData.get("title"),
    due_date: formData.get("due_date"),
    estimated_hours: formData.get("estimated_hours"),
    priority: formData.get("priority"),
  });

  if (!parsed.success) {
    redirect(`/?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { error } = await supabase.from("assignments").insert({
    course_id: parsed.data.course_id,
    title: parsed.data.title,
    due_date: parsed.data.due_date || null,
    estimated_hours: parsed.data.estimated_hours ?? null,
    priority: parsed.data.priority,
    user_id: user.id,
  });

  if (error) {
    redirect(`/?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  redirect("/");
}