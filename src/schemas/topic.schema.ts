import { z } from "zod";

const SUBJECT_VALUES = [
  "math",
  "science",
  "history",
  "language",
  "general",
  "chemistry",
  "physics",
  "biology",
  "geography",
  "economics",
  "political science",
  "psychology",
  "sociology",
  "philosophy",
  "art",
  "music",
  "physical education",
  "computer science",
] as const;

const UpdateTopicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title must be a non-empty string")
    .optional(),
  subject: z.enum(SUBJECT_VALUES).optional(),
});

const StartTopicWithResourcesSchema = z.object({
  sourceIds: z.array(z.string()).min(1, "At least one source ID is required"),
  userMessage: z.string(),
});

type Subject = (typeof SUBJECT_VALUES)[number];
type UpdateTopicInput = z.infer<typeof UpdateTopicSchema>;

export {
    StartTopicWithResourcesSchema,
    Subject,
    SUBJECT_VALUES,
    UpdateTopicInput,
    UpdateTopicSchema
};
