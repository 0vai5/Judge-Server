import { Request, Response } from "express";
import CustomError from "http-errors";
import {
  createTopic,
  findTopicsByUser,
  findTopicById,
  updateTopic,
  softDeleteTopic,
} from "../../dbActions/task.actions";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";

const ALLOWED_SUBJECTS = [
  "math",
  "science",
  "history",
  "language",
  "general",
  "chemistry",
  "physics",
  "biology",
  "geography",
  "economics",
  "political science",
  "psychology",
  "sociology",
  "philosophy",
  "art",
  "music",
  "physical education",
  "computer science",
] as const;
type Subject = (typeof ALLOWED_SUBJECTS)[number];

const isValidSubject = (value: any): value is Subject =>
  ALLOWED_SUBJECTS.includes(value);

const StartTopic = asyncHandler(async (req: Request, res: Response) => {
  const { subject  } = req.body ?? {};

  if (subject !== undefined && !isValidSubject(subject)) {
    throw CustomError(
      400,
      `Subject must be one of: ${ALLOWED_SUBJECTS.join(", ")}`,
    );
  }

  const userId = req.user!.id;
  const topic = await createTopic(userId, subject);

  return res
    .status(201)
    .json(new APIResponse("Topic started successfully", { topic }));
});

const GetTopics = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const topics = await findTopicsByUser(userId);
  return res
    .status(200)
    .json(new APIResponse("Topics fetched successfully", { topics }));
});

const GetTopic = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = req?.params?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw CustomError(400, "Invalid topic ID");
  }

  const topic = await findTopicById(id, userId);
  if (!topic) throw CustomError(404, "Topic not found");
  return res
    .status(200)
    .json(new APIResponse("Topic fetched successfully", { topic }));
});

const UpdateTopic = asyncHandler(async (req: Request, res: Response) => {
  const { title, subject } = req.body;

  if (subject !== undefined && !isValidSubject(subject)) {
    throw CustomError(
      400,
      `Subject must be one of: ${ALLOWED_SUBJECTS.join(", ")}`,
    );
  }
  if (title !== undefined && (typeof title !== "string" || !title.trim())) {
    throw CustomError(400, "Title must be a non-empty string");
  }

  const data: Partial<{ title: string; subject: Subject }> = {};
  if (title !== undefined) data.title = title.trim();
  if (subject !== undefined) data.subject = subject;

  const userId = req.user!.id;
  const id = req?.params?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw CustomError(400, "Invalid topic ID");
  }
  const topic = await updateTopic(id, userId, data);
  if (!topic) throw CustomError(404, "Topic not found");
  return res
    .status(200)
    .json(new APIResponse("Topic updated successfully", { topic }));
});

const DeleteTopic = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const id = req?.params?.id;
  if (!id || typeof id !== "string" || !id.trim()) {
    throw CustomError(400, "Invalid topic ID");
  }
  const topic = await softDeleteTopic(id, userId);
  if (!topic) throw CustomError(404, "Topic not found");
  return res.status(200).json(new APIResponse("Topic deleted successfully"));
});

export { StartTopic, GetTopics, GetTopic, UpdateTopic, DeleteTopic };
