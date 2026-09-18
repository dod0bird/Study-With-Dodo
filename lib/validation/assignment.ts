import { z } from "zod";

export const assignmentSchema = z.object({
  course_id: z.string().uuid({ error: "Please select a course" }),
  title: z.string().trim().min(1, { error: "Title is required" }).max(200),
  due_date: z.string().optional().or(z.literal("")),
  estimated_hours: z.coerce.number().min(0).max(1000).optional(),
  priority: z.enum(["low", "medium", "high"]),
});