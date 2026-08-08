import CustomError from "http-errors";
import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import env from "../config/env";

const { JWT_SECRET, JWT_EXPIRES_IN } = env;

export interface TokenPayload {
  id: string;
  role: string;
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const generateToken = (id: string, role: string) => {
  const expiresIn = (JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

  return jwt.sign({ id, role }, JWT_SECRET as string, {
    expiresIn,
  });
};

export const verifyToken = (token: string) => {
  try {
    const key = JWT_SECRET;
    const decoded = jwt.verify(token, key as string);

    if (
      typeof decoded !== "object" ||
      !decoded ||
      typeof decoded.id !== "string" ||
      typeof decoded.role !== "string"
    ) {
      throw CustomError(401, "Invalid token payload");
    }

    return {
      id: decoded.id,
      role: decoded.role,
    } as TokenPayload;
  } catch (error) {
    if ((error as { status?: number })?.status === 401) {
      throw error;
    }

    throw CustomError(401, "Expired or invalid token");
  }
};
