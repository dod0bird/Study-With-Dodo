"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { courseSchema } from "@/lib/validation/course";

export async function createCourse(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = courseSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect(`/courses?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { error } = await supabase.from("courses").insert({
    code: parsed.data.code,
    name: parsed.data.name,
    description: parsed.data.description || null,
    user_id: user.id,
  });

  if (error) {
    redirect(`/courses?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/courses");
  redirect("/courses");
}

export async function updateCourse(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;

  const parsed = courseSchema.safeParse({
    code: formData.get("code"),
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    redirect(`/courses?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }

  const { error } = await supabase
    .from("courses")
    .update({
      code: parsed.data.code,
      name: parsed.data.name,
      description: parsed.data.description || null,
    })
    .eq("id", id);

  if (error) {
    redirect(`/courses?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/courses");
  redirect("/courses");
}

export async function archiveCourse(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("courses")
    .update({ archived: true })
    .eq("id", id);

  if (error) {
    redirect(`/courses?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/courses");
  redirect("/courses");
}