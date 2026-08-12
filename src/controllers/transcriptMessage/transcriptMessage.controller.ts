import { Request, Response } from "express";
import CustomError from "http-errors";
import { findSessionById } from "../../dbActions/session.actions";
import {
  createTranscriptMessage,
  findMessagesBySession,
} from "../../dbActions/transcriptMessage.actions";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";

const ALLOWED_ROLES = ["user", "assistant"] as const;
type Role = (typeof ALLOWED_ROLES)[number];
const isValidRole = (value: any): value is Role =>
  ALLOWED_ROLES.includes(value);

const CreateMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const sessionId = req?.params?.sessionId;
  if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
    throw CustomError(400, "Invalid session ID");
  }

  const session = await findSessionById(sessionId, userId);
  if (!session) throw CustomError(404, "Session not found");

  const { role, content } = req.body ?? {};
  if (!isValidRole(role)) {
    throw CustomError(400, `Role must be one of: ${ALLOWED_ROLES.join(", ")}`);
  }
  if (typeof content !== "string" || !content.trim()) {
    throw CustomError(400, "Content is required");
  }

  const message = await createTranscriptMessage({
    sessionId,
    userId,
    role,
    content: content.trim(),
  });

  return res
    .status(201)
    .json(new APIResponse("Message logged successfully", { message }));
});

const GetSessionMessages = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const sessionId = req?.params?.sessionId;
  if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
    throw CustomError(400, "Invalid session ID");
  }

  const session = await findSessionById(sessionId, userId);
  if (!session) throw CustomError(404, "Session not found");

  const messages = await findMessagesBySession(sessionId);
  return res
    .status(200)
    .json(new APIResponse("Messages fetched successfully", { messages }));
});

export { CreateMessage, GetSessionMessages };
