import { completeAssignment } from "@/app/actions/assignments";
import { formatMinutes } from "@/lib/format";

export type Priority = "low" | "medium" | "high";
export type AssignmentStatus = "not_started" | "in_progress" | "done";

export interface Assignment {
  id: string;
  title: string;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  priority: Priority;
  status: AssignmentStatus;
  courses: { code: string } | null;
}

const priorityStyles: Record<Priority, string> = {
  low: "bg-zinc-100 text-zinc-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function AssignmentCard({
  assignment,
  minutesSpent,
}: {
  assignment: Assignment;
  minutesSpent: number;
}) {
    const remainingMinutes =
    assignment.estimated_hours != null
        ? Math.max(0, assignment.estimated_hours * 60 - minutesSpent)
        : null;
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{assignment.courses?.code}</p>
          <h2 className="text-lg font-semibold">{assignment.title}</h2>
          <p className="text-sm text-zinc-600">
            Due {assignment.due_date ?? "—"} · Est. {assignment.estimated_hours ?? "—"}h
          </p>
            {assignment.status !== "done" && remainingMinutes !== null && (
            <p className="text-sm text-zinc-500">
                Time spent so far: {formatMinutes(minutesSpent)} · Estimated Remaining: {formatMinutes(remainingMinutes)}
            </p>
            )}
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${priorityStyles[assignment.priority]}`}
        >
          {assignment.priority}
        </span>
      </div>

      {assignment.status === "done" ? (
        <p className="text-sm text-green-700">
          ✓ Completed — actual time: {assignment.actual_hours ?? "—"}h
        </p>
      ) : (
        <form action={completeAssignment} className="flex items-center gap-2">
          <input type="hidden" name="id" value={assignment.id} />
          <input
            name="actual_hours"
            type="number"
            step="0.5"
            min="0"
            placeholder="Actual hours"
            className="border rounded-lg p-1 text-sm w-32"
          />
          <button className="text-sm border rounded-lg px-3 py-1">Mark complete</button>
        </form>
      )}
    </div>
  );
}