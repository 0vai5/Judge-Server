import { string, z } from "zod";

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

const StartTopicSchema = z.object({
  subject: z.enum(SUBJECT_VALUES).optional(),
});

const UpdateTopicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title must be a non-empty string")
    .optional(),
  subject: z.enum(SUBJECT_VALUES).optional(),
});

const StartTopicWithResourcesSchema = z.object({
  s3Keys: z.array(z.string()),
  userMessage: z.string(),
});

type Subject = (typeof SUBJECT_VALUES)[number];
type StartTopicInput = z.infer<typeof StartTopicSchema>;
type UpdateTopicInput = z.infer<typeof UpdateTopicSchema>;

export {
  SUBJECT_VALUES,
  Subject,
  StartTopicSchema,
  StartTopicInput,
  UpdateTopicSchema,
  UpdateTopicInput,
  StartTopicWithResourcesSchema
};
