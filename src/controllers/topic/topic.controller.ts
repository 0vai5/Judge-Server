import { Request, Response } from "express";
import CustomError from "http-errors";
import {
  createTopic,
  findTopicsByUser,
  findTopicById,
  updateTopic,
  softDeleteTopic,
} from "../../dbActions/topic.actions";
import {
  StartTopicSchema,
  UpdateTopicSchema,
  StartTopicWithResourcesSchema,
} from "../../schemas/topic.schema";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import validate from "../../utils/validation";
import { extractTextFromSource } from "../../services/extraction.service";

const StartTopic = asyncHandler(async (req: Request, res: Response) => {
  const { data, success, error } = validate(StartTopicSchema, req.body ?? {});
  if (!success) {
    const message = error.issues?.[0]?.message || "Validation failed";
    throw CustomError(400, message);
  }

  const { subject } = data;
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
  const { data, success, error } = validate(UpdateTopicSchema, req.body ?? {});
  if (!success) {
    const message = error.issues?.[0]?.message || "Validation failed";
    throw CustomError(400, message);
  }

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

const startTopicWithResources = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, success, error } = validate(
      StartTopicWithResourcesSchema,
      req.body ?? {},
    );
    if (!success) {
      const message = error.issues?.[0]?.message || "Validation failed";
      throw CustomError(400, message);
    }

    // Download Per File and Extract (LOOP EACH FILE ONE BY ONE)
    // Chunk it
    // Embed Each chunk
    // Title Call
    // Topic Insertion/Creation
    // Resource Creation
    // SessionCreation
    // transcript MessageCreation
  },
);

export { StartTopic, GetTopics, GetTopic, UpdateTopic, DeleteTopic };
