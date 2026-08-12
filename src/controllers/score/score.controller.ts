import { Request, Response } from "express";
import CustomError from "http-errors";
import { createScore, findScoreBySession } from "../../dbActions/score.actions";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";

const isNumberInRange = (v: unknown) =>
  typeof v === "number" && v >= 1 && v <= 10;

const CreateScore = asyncHandler(async (req: Request, res: Response) => {
  const { sessionId, clarity, completeness, correctness, gaps, suggestedRevisitPoints } =
    req.body ?? {};

  if (!sessionId || typeof sessionId !== "string") {
    throw CustomError(400, "sessionId is required");
  }
  if (![clarity, completeness, correctness].every(isNumberInRange)) {
    throw CustomError(400, "clarity, completeness, correctness must be numbers 1-10");
  }
  if (!Array.isArray(gaps) || !Array.isArray(suggestedRevisitPoints)) {
    throw CustomError(400, "gaps and suggestedRevisitPoints must be arrays");
  }

  // createScore itself throws 400 if session isn't "completed" yet
  const score = await createScore(sessionId, {
    clarity,
    completeness,
    correctness,
    gaps,
    suggestedRevisitPoints,
  });

  return res.status(201).json(new APIResponse("Score created successfully", { score }));
});

const GetScore = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req?.params?.sessionId;
  if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
    throw CustomError(400, "Invalid session ID");
  }

  const score = await findScoreBySession(sessionId);
  if (!score) throw CustomError(404, "Score not found");
  return res.status(200).json(new APIResponse("Score fetched successfully", { score }));
});

export { CreateScore, GetScore };