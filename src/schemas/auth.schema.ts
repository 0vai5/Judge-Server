import { z } from "zod";
import { UserSchema } from "./user.schema";

const LoginSchema = UserSchema.pick({
  email: true,
  password: true,
});
const SignupSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
});

type Login = z.infer<typeof LoginSchema>;
type Signup = z.infer<typeof SignupSchema>;

export { Login, LoginSchema, Signup, SignupSchema };
