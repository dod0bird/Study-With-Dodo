export type Priority = "low" | "medium" | "high";
export type AssignmentStatus = "not_started" | "in_progress" | "done";

export interface Assignment {
  title: string;
  courseCode: string;
  dueDate: string;
  estimatedHours: number;
  priority: Priority;
  status: AssignmentStatus;
}

const priorityStyles: Record<Priority, string> = {
  low: "bg-zinc-100 text-zinc-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <div className="border rounded-lg p-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-zinc-500">{assignment.courseCode}</p>
        <h2 className="text-lg font-semibold">{assignment.title}</h2>
        <p className="text-sm text-zinc-600">
          Due {assignment.dueDate} · Est. {assignment.estimatedHours}h
        </p>
      </div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${priorityStyles[assignment.priority]}`}
      >
        {assignment.priority}
      </span>
    </div>
  );
}