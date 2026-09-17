import { z } from "zod";

export const studySessionSchema = z.object({
  course_id: z.string().uuid("Please select a course"),
  start_at: z.string().min(1, "Start time is required"),
  duration_minutes: z.coerce.number().min(1, "Duration must be at least 1 minute").max(1000),
  focus_rating: z.coerce.number().min(1).max(5).optional(),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});