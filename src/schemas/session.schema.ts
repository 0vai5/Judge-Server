import { z } from "zod";

const StartSessionSchema = z.object({
  topicId: z.string().trim().min(1, "topicId is required"),
});

const EndSessionSchema = z.object({
  status: z.enum(["completed", "abandoned"]),
});

type StartSessionInput = z.infer<typeof StartSessionSchema>;
type EndSessionInput = z.infer<typeof EndSessionSchema>;

export { StartSessionSchema, StartSessionInput, EndSessionSchema, EndSessionInput };