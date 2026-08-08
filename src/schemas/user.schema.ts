import { z } from "zod";

const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).default("user"),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
});

type User = z.infer<typeof UserSchema>;

export { User, UserSchema };
