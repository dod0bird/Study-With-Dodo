import { requireUser } from "@/lib/auth";
import { formatMinutes } from "@/lib/format";

export default async function Home() {
  const { supabase } = await requireUser();

  const { data: assignments, error: assignmentsError } = await supabase
    .from("assignments")
    .select("*, courses!inner(archived)")
    .eq("courses.archived", false);

  const { data: studySessions, error: sessionsError } = await supabase
    .from("study_sessions")
    .select("duration_minutes");

  if (assignmentsError || sessionsError) {
    return <p className="p-8 text-red-600">Failed to load dashboard.</p>;
  }

  const notDoneAssignments = assignments.filter((a) => a.status !== "done");
  const doneAssignments = assignments.filter((a) => a.status === "done");

  const totalEstimatedHours = notDoneAssignments.reduce(
    (sum, a) => sum + (a.estimated_hours ?? 0),
    0
  );

  const totalStudyMinutes = studySessions.reduce(
    (sum, s) => sum + s.duration_minutes,
    0
  );

  return (
    <main className="p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-xs text-zinc-500">Upcoming assignments</p>
          <p className="text-2xl font-bold">{notDoneAssignments.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-zinc-500">Estimated hours remaining</p>
          <p className="text-2xl font-bold">{totalEstimatedHours.toFixed(1)}h</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-zinc-500">Completed assignments</p>
          <p className="text-2xl font-bold">{doneAssignments.length}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-xs text-zinc-500">Total time studied</p>
          <p className="text-2xl font-bold">{formatMinutes(totalStudyMinutes)}</p>
        </div>
      </section>
    </main>
  );
}