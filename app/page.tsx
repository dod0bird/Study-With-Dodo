import { redirect } from "next/navigation";
import CourseCard, { Course } from "@/components/CourseCard";
import AssignmentCard, { Assignment } from "@/components/AssignmentCard";
import { createClient } from "@/lib/supabase/server";
import { createCourse } from "@/app/actions/courses";
import { createAssignment } from "@/app/actions/assignments";
import StudySessionCard, { StudySession } from "@/components/StudySessionCard";
import { createStudySession } from "@/app/actions/study-sessions";


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {

  const { error } = await searchParams;
  
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
    .select("*, courses(code)");

  const { data: studySessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("*, courses(code)")
    .order("start_at", { ascending: false });

  if (coursesError || assignmentsError || sessionsError) {
    return <p className="p-8 text-red-600">Failed to load data.</p>;
  }

  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">My Courses</h1>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
          <form action={createCourse} className="flex flex-col gap-2 border-t pt-4">
            <input name="code" placeholder="Course code (e.g. CPSC 210)" required className="border rounded-lg p-2" />
            <input name="name" placeholder="Course name" required className="border rounded-lg p-2" />
            <input name="description" placeholder="Description (optional)" className="border rounded-lg p-2" />
            <button className="bg-black text-white rounded-lg p-2">Add course</button>
          </form>
      </section>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Assignments</h1>
        {assignments.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} />
        ))}
        <form action={createAssignment} className="flex flex-col gap-2 border-t pt-4">
        <select name="course_id" required className="border rounded-lg p-2">
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} — {course.name}
            </option>
          ))}
          </select>
          <input name="title" placeholder="Assignment title" required className="border rounded-lg p-2" />
          <input name="due_date" type="date" className="border rounded-lg p-2" />
          <input name="estimated_hours" type="number" step="0.5" min="0" placeholder="Estimated hours" className="border rounded-lg p-2" />
          <select name="priority" defaultValue="medium" className="border rounded-lg p-2">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <button className="bg-black text-white rounded-lg p-2">Add assignment</button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Study Sessions</h1>
        {studySessions.map((session) => (
          <StudySessionCard key={session.id} session={session} />
        ))}
        <form action={createStudySession} className="flex flex-col gap-2 border-t pt-4">
          <select name="course_id" required className="border rounded-lg p-2">
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.code} — {course.name}
              </option>
            ))}
          </select>
          <input name="start_at" type="datetime-local" required className="border rounded-lg p-2" />
          <input name="duration_minutes" type="number" min="1" placeholder="Duration (minutes)" required className="border rounded-lg p-2" />
          <select name="focus_rating" defaultValue="" className="border rounded-lg p-2">
            <option value="">Focus rating (optional)</option>
            <option value="1">1 — Very distracted</option>
            <option value="2">2</option>
            <option value="3">3 — Okay</option>
            <option value="4">4</option>
            <option value="5">5 — Fully focused</option>
          </select>
          <input name="notes" placeholder="Notes (optional)" className="border rounded-lg p-2" />
          <button className="bg-black text-white rounded-lg p-2">Log study session</button>
        </form>
      </section>
    </main>
  );
}

