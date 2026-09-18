import { z } from "zod";

export const courseSchema = z.object({
  code: z.string().trim().min(1, { error: "Course code is required" }).max(20),
  name: z.string().trim().min(1, { error: "Course name is required" }).max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
});