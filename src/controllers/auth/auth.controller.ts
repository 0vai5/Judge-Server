import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import CustomError from "http-errors";
import { createUser, findUserByEmail } from "../../dbActions/user.actions";
import { LoginSchema, SignupSchema } from "../../schemas/auth.schema";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import validate from "../../utils/validation";
import { generateToken } from "../../utils/token";

const normalizeEmail = (email: string) => {
  return email.toLowerCase().trim();
};

const Signup = asyncHandler(async (req: Request, res: Response) => {
  const { data, success, error } = validate(SignupSchema, req.body);

  if (!success) {
    const message = error.issues?.[0]?.message || "Validation failed";
    throw CustomError(400, message);
  }

  const { name, email, password } = data;

  const correctedEmail = normalizeEmail(email);

  const existingUser = await findUserByEmail(correctedEmail);
  if (existingUser) {
    throw CustomError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createUser(name, correctedEmail, hashedPassword);

  if (!newUser) {
    throw CustomError(500, "Failed to create user");
  }

  const token = generateToken(newUser.id, newUser.role);

  const { password: _, ...safeUser } = newUser;
  return res
    .status(201)
    .json(
      new APIResponse("User created successfully", { user: safeUser, token }),
    );
});

const Login = asyncHandler(async (req: Request, res: Response) => {
  const { data, success, error } = validate(LoginSchema, req.body);
  if (!success) {
    const message = error.issues?.[0]?.message || "Validation failed";
    throw CustomError(400, message);
  }

  const { email, password } = data;

  const correctedEmail = normalizeEmail(email);

  const user = await findUserByEmail(correctedEmail);
  if (!user) {
    throw CustomError(400, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw CustomError(400, "Invalid email or password");
  }

  const token = generateToken(user.id, user.role);

  const { password: _, ...safeUser } = user;
  return res
    .status(200)
    .json(new APIResponse("Login successful", { user: safeUser, token }));
});

export { Signup, Login };
