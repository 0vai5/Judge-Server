import { Request, Response } from "express";
import CustomError from "http-errors";
import { findSessionById } from "../../dbActions/session.actions";
import {
    createTranscriptMessage,
    findMessagesBySession,
} from "../../dbActions/transcriptMessage.actions";
import { TranscriptMessageSchema } from "../../schemas/transcriptMessage.schema";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import validate from "../../utils/validation";

const CreateMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const sessionId = req?.params?.sessionId;
  if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
    throw CustomError(400, "Invalid session ID");
  }

  const session = await findSessionById(sessionId, userId);
  if (!session) throw CustomError(404, "Session not found");

  const { data, success, error } = validate(TranscriptMessageSchema, req.body);
  if (!success) {
    const message = error.issues?.[0]?.message || "Validation failed";
    throw CustomError(400, message);
  }

  const message = await createTranscriptMessage({
    sessionId,
    userId,
    role: data.role,
    content: data.content,
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
