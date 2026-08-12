import { z } from "zod";

const TranscriptMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1, "Content is required"),
});

type TranscriptMessageInput = z.infer<typeof TranscriptMessageSchema>;

export { TranscriptMessageInput, TranscriptMessageSchema };