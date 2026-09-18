export interface StudySession {
  id: string;
  start_at: string;
  duration_minutes: number;
  focus_rating: number | null;
  notes: string | null;
  courses: { code: string } | null;
  assignments: { title: string } | null;
}

export default function StudySessionCard({ session }: { session: StudySession }) {
  const start = new Date(session.start_at);

  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-zinc-500">
        {session.courses?.code}
        {session.assignments?.title ? ` · ${session.assignments.title}` : ""}
      </p>
      <h2 className="text-lg font-semibold">
        {start.toLocaleDateString()} · {start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
      </h2>
      <p className="text-sm text-zinc-600">
        {session.duration_minutes} minutes
        {session.focus_rating ? ` · Focus: ${session.focus_rating}/5` : ""}
      </p>
      {session.notes && <p className="text-sm text-zinc-600 mt-1">{session.notes}</p>}
    </div>
  );
}