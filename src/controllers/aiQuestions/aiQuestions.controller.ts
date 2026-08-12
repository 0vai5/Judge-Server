import { Request, Response } from "express";
import CustomError from "http-errors";
import {
  findQuestionsBySession,
  findAiQuestionById,
  deleteAiQuestion,
} from "../../dbActions/aiQuestions.actions";
import { findSessionById } from "../../dbActions/session.actions"; // assumes this exists from Day 8 sessions work
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";

const GetSessionQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const sessionId = req?.params?.sessionId;

    if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
      throw CustomError(400, "Invalid session ID");
    }

    const session = await findSessionById(sessionId, userId);
    if (!session) throw CustomError(404, "Session not found");

    const questions = await findQuestionsBySession(sessionId);
    return res
      .status(200)
      .json(new APIResponse("Questions fetched successfully", { questions }));
  },
);

const GetAiQuestion = asyncHandler(async (req: Request, res: Response) => {
  const id = req?.params?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw CustomError(400, "Invalid question ID");
  }

  const question = await findAiQuestionById(id);
  if (!question) throw CustomError(404, "Question not found");
  return res
    .status(200)
    .json(new APIResponse("Question fetched successfully", { question }));
});

const DeleteAiQuestion = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req?.params?.sessionId;
  const id = req?.params?.id;
  if (!sessionId || !id) {
    throw CustomError(400, "Invalid session or question ID");
  }

  if (typeof sessionId !== "string" || typeof id !== "string") {
    throw CustomError(400, "Session ID and Question ID cannot be empty");
  }

  const question = await deleteAiQuestion(id, sessionId);
  if (!question) throw CustomError(404, "Question not found");
  return res.status(200).json(new APIResponse("Question deleted successfully"));
});

export { GetSessionQuestions, GetAiQuestion, DeleteAiQuestion };
