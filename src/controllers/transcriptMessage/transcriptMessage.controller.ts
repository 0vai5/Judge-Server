import { Request, Response } from "express";
import CustomError from "http-errors";
import { endSession, findSessionById } from "../../dbActions/session.actions";
import {
  createTranscriptMessage,
  findFirstUserMessageBySession,
  findMessagesBySession,
} from "../../dbActions/transcriptMessage.actions";
import { TranscriptMessageSchema } from "../../schemas/transcriptMessage.schema";
import { generateTopicTitle } from "../../services/autoTitle.service";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import { isSessionExpired } from "../../utils/sessionCap";
import validate from "../../utils/validation";

const CreateMessage = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const sessionId = req.params.sessionId;

  if (typeof sessionId !== "string" || !sessionId?.trim()) {
    throw CustomError(400, "Invalid session ID");
  }

  const session = await findSessionById(sessionId, userId);

  if (!session) {
    throw CustomError(404, "Session not found");
  }

  if (session.status === "active" && isSessionExpired(session.startedAt)) {
    await endSession(sessionId, userId, "completed");

    throw CustomError(410, "Session time limit reached");
  }

  const { data, success, error } = validate(TranscriptMessageSchema, req.body);

  if (!success) {
    throw CustomError(400, error.issues?.[0]?.message || "Validation failed");
  }

  // User's Message is the first message.

  const isFirstUserMessage =
    data.role === "user" && !(await findFirstUserMessageBySession(sessionId));

  // Message document creation

  const message = await createTranscriptMessage({
    sessionId,
    userId,
    role: data.role,
    content: data.content,
  });

  let topicInfo = null;

  const { content } = data;

  if (isFirstUserMessage) {
    topicInfo = await generateTopicTitle(sessionId, userId, content);
  }

  return res.status(201).json(
    new APIResponse("Message logged successfully", {
      message,
      topic: topicInfo,
    }),
  );
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
