"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createStudySession } from "@/app/actions/study-sessions";

interface Course {
  id: string;
  code: string;
  name: string;
}

export default function StudyTimer({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  function handleStart() {
    if (!courseId) return;
    setStartTime(new Date());
    setElapsedSeconds(0);
    setIsRunning(true);
  }

  async function handleStop() {
    if (!startTime) return;
    setIsRunning(false);

    const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

    const formData = new FormData();
    formData.set("course_id", courseId);
    formData.set("assignment_id", "");
    formData.set("focus_rating", "");
    formData.set("notes", "");
    formData.set("start_at", startTime.toISOString());
    formData.set("duration_minutes", String(durationMinutes));

    await createStudySession(formData);
    router.refresh();
  }

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="font-semibold">Live timer</h3>
      <select
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        disabled={isRunning}
        className="border rounded-lg p-2"
      >
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.code} — {course.name}
          </option>
        ))}
      </select>
      <p className="text-2xl font-mono">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
      {isRunning ? (
        <button onClick={handleStop} className="bg-black text-white rounded-lg p-2">
          Stop
        </button>
      ) : (
        <button
          onClick={handleStart}
          disabled={!courseId}
          className="bg-black text-white rounded-lg p-2 disabled:opacity-50"
        >
          Start
        </button>
      )}
    </div>
  );
}