import { z } from "zod";

const FileMetaSchema = z.object({
  name: z.string().trim().min(1, "File name is required"),
  size: z.number().positive("File size must be positive"),
  contentType: z.string().trim().min(1, "Content type is required"),
});

const PresignRequestSchema = z.object({
  files: z.array(FileMetaSchema).min(1, "At least one file is required").max(10, "Max 10 files at once"),
});

type PresignRequestInput = z.infer<typeof PresignRequestSchema>;

export { PresignRequestSchema, PresignRequestInput };