import { requireUser } from "@/lib/auth";
import StudySessionCard from "@/components/StudySessionCard";
import StudyTimer from "@/components/StudyTimer";
import { createStudySession } from "@/app/actions/study-sessions";

export default async function StudySessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase } = await requireUser();

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .eq("archived", false);

  const { data: assignments, error: assignmentsError } = await supabase
    .from("assignments")
    .select("*, courses!inner(code, archived)")
    .eq("courses.archived", false);

  const { data: studySessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("*, courses(code), assignments(title)")
    .order("start_at", { ascending: false });

  if (coursesError || assignmentsError || sessionsError) {
    return <p className="p-8 text-red-600">Failed to load study sessions.</p>;
  }

  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Study Sessions</h1>
      {studySessions.map((session) => (
        <StudySessionCard key={session.id} session={session} />
      ))}

      <StudyTimer
        courses={courses}
        assignments={assignments.map((a) => ({ id: a.id, title: a.title, course_id: a.course_id }))}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}
      <form action={createStudySession} className="flex flex-col gap-2 border-t pt-4">
        <select name="course_id" required className="border rounded-lg p-2">
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} — {course.name}
            </option>
          ))}
        </select>
        <select name="assignment_id" defaultValue="" className="border rounded-lg p-2">
          <option value="">No specific assignment (general studying)</option>
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title}
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
    </main>
  );
}