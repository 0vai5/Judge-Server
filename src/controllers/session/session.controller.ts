import { Request, Response } from "express";
import CustomError from "http-errors";
import {
  createSession,
  endSession,
  findSessionById,
  findSessionsByUser,
  softDeleteSession,
} from "../../dbActions/session.actions";
import {
  EndSessionSchema,
  StartSessionSchema,
} from "../../schemas/session.schema";
import { scoreSession } from "../../services/scoring.service";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import validate from "../../utils/validation";

const StartSession = asyncHandler(async (req: Request, res: Response) => {
  const { data, success, error } = validate(StartSessionSchema, req.body ?? {});
  if (!success) {
    const message = error.issues?.[0]?.message || "Validation failed";
    throw CustomError(400, message);
  }

  const { topicId } = data;
  const userId = req.user!.id;
  const session = await createSession(userId, topicId);

  return res
    .status(201)
    .json(new APIResponse("Session started successfully", { session }));
});

const GetSessions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const sessions = await findSessionsByUser(userId);
  return res
    .status(200)
    .json(new APIResponse("Sessions fetched successfully", { sessions }));
});

const GetSession = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = req?.params?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw CustomError(400, "Invalid session ID");
  }

  const session = await findSessionById(id, userId);
  if (!session) throw CustomError(404, "Session not found");
  return res
    .status(200)
    .json(new APIResponse("Session fetched successfully", { session }));
});

const EndSession = asyncHandler(async (req: Request, res: Response) => {
  const { data, success, error } = validate(EndSessionSchema, req.body ?? {});
  if (!success) {
    const message = error.issues?.[0]?.message || "Validation failed";
    throw CustomError(400, message);
  }

  const { status } = data;
  const userId = req.user!.id;
  const id = req?.params?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw CustomError(400, "Invalid session ID");
  }

  const session = await endSession(id, userId, status);
  if (!session) throw CustomError(404, "Session not found");

  if (status === "completed") {
    try {
      await scoreSession(id);
    } catch (err) {
      console.error("Auto-scoring failed for session", id, err);
    }
  }

  return res
    .status(200)
    .json(new APIResponse("Session ended successfully", { session }));
});

const DeleteSession = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = req?.params?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw CustomError(400, "Invalid session ID");
  }
  const session = await softDeleteSession(id, userId);
  if (!session) throw CustomError(404, "Session not found");
  return res.status(200).json(new APIResponse("Session deleted successfully"));
});

export { DeleteSession, EndSession, GetSession, GetSessions, StartSession };
