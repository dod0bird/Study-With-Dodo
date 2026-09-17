import { z } from "zod";

export const studySessionSchema = z.object({
  course_id: z.string().uuid({ error: "Please select a course" }),
  assignment_id: z.string().uuid().optional().or(z.literal("")),
  start_at: z.string().min(1, { error: "Start time is required" }),
  duration_minutes: z.coerce.number().min(0).max(1000),
  focus_rating: z.coerce.number().min(1).max(5).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});