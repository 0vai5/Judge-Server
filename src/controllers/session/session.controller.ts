import { Request, Response } from "express";
import CustomError from "http-errors";
import {
  createSession,
  findSessionsByUser,
  findSessionById,
  endSession,
  softDeleteSession,
} from "../../dbActions/session.actions";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";

const StartSession = asyncHandler(async (req: Request, res: Response) => {
  const { topicId } = req.body ?? {};
  if (!topicId || typeof topicId !== "string") {
    throw CustomError(400, "topicId is required");
  }

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
  const { status } = req.body ?? {};
  if (status !== "completed" && status !== "abandoned") {
    throw CustomError(400, "status must be 'completed' or 'abandoned'");
  }

  const userId = req.user!.id;
  const id = req?.params?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw CustomError(400, "Invalid session ID");
  }

  const session = await endSession(id, userId, status);
  if (!session) throw CustomError(404, "Session not found");
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

export {
  StartSession,
  GetSessions,
  GetSession,
  EndSession,
  DeleteSession,
};