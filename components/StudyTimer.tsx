"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createStudySession } from "@/app/actions/study-sessions";

interface Course {
  id: string;
  code: string;
  name: string;
}

interface AssignmentOption {
  id: string;
  title: string;
  course_id: string;
}

export default function StudyTimer({
  courses,
  assignments,
}: {
  courses: Course[];
  assignments: AssignmentOption[];
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [phase, setPhase] = useState<"idle" | "running" | "review">("idle");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalDurationMinutes, setFinalDurationMinutes] = useState(0);
  const [assignmentId, setAssignmentId] = useState("");

  useEffect(() => {
    if (phase !== "running") return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  function handleStart() {
    if (!courseId) return;
    setStartTime(new Date());
    setElapsedSeconds(0);
    setPhase("running");
  }

  function handleStop() {
    setFinalDurationMinutes(Math.max(1, Math.round(elapsedSeconds / 60)));
    setPhase("review");
  }

  async function handleSave() {
    if (!startTime) return;

    const formData = new FormData();
    formData.set("course_id", courseId);
    formData.set("assignment_id", assignmentId);
    formData.set("start_at", startTime.toISOString());
    formData.set("duration_minutes", String(finalDurationMinutes));
    formData.set("focus_rating", "");
    formData.set("notes", "");

    await createStudySession(formData);
    router.refresh();

    setPhase("idle");
    setElapsedSeconds(0);
    setAssignmentId("");
  }

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const relevantAssignments = assignments.filter((a) => a.course_id === courseId);

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="font-semibold">Live timer</h3>

      {phase !== "review" && (
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          disabled={phase === "running"}
          className="border rounded-lg p-2"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} — {course.name}
            </option>
          ))}
        </select>
      )}

      {phase !== "review" && (
        <p className="text-2xl font-mono">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
      )}

      {phase === "idle" && (
        <button
          onClick={handleStart}
          disabled={!courseId}
          className="bg-black text-white rounded-lg p-2 disabled:opacity-50"
        >
          Start
        </button>
      )}

      {phase === "running" && (
        <button onClick={handleStop} className="bg-black text-white rounded-lg p-2">
          Stop
        </button>
      )}

      {phase === "review" && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-zinc-600">
            Session complete: {finalDurationMinutes} minute{finalDurationMinutes === 1 ? "" : "s"}
          </p>
          <select
            value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">General studying (no assignment)</option>
            {relevantAssignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
          <button onClick={handleSave} className="bg-black text-white rounded-lg p-2">
            Save session
          </button>
        </div>
      )}
    </div>
  );
}