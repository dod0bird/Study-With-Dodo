import { requireUser } from "@/lib/auth";
import AssignmentCard from "@/components/AssignmentCard";
import { createAssignment } from "@/app/actions/assignments";

export default async function AssignmentsPage({
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
    .select("assignment_id, duration_minutes");

  if (coursesError || assignmentsError || sessionsError) {
    return <p className="p-8 text-red-600">Failed to load assignments.</p>;
  }

  const minutesSpentByAssignment = new Map<string, number>();
  for (const session of studySessions) {
    if (session.assignment_id) {
      minutesSpentByAssignment.set(
        session.assignment_id,
        (minutesSpentByAssignment.get(session.assignment_id) ?? 0) + session.duration_minutes
      );
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Assignments</h1>
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          minutesSpent={minutesSpentByAssignment.get(assignment.id) ?? 0}
        />
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
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
    </main>
  );
}