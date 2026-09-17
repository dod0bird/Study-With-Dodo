import { redirect } from "next/navigation";
import CourseCard, { Course } from "@/components/CourseCard";
import AssignmentCard, { Assignment } from "@/components/AssignmentCard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*");

  const { data: assignments, error: assignmentsError } = await supabase
    .from("assignments")
    .select("*");

  if (coursesError || assignmentsError) {
    return <p className="p-8 text-red-600">Failed to load data.</p>;
  }

  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">My Courses</h1>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </section>
    </main>
  );
}