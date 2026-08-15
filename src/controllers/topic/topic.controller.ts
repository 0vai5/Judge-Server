import { Request, Response } from "express";
import CustomError from "http-errors";
import { db } from "../../config/db";
import {
  findTopicById,
  findTopicsByUser,
  softDeleteTopic,
  updateTopic,
} from "../../dbActions/topic.actions";
import { createTopicWithSessionAndMessage } from "../../dbActions/topicOrchestration.actions";
import { insertChunks } from "../../dbActions/topicResource.actions";
import {
  StartTopicWithResourcesSchema,
  UpdateTopicSchema,
} from "../../schemas/topic.schema";
import {
  embedAllChunks,
  extractAllSourcesText,
} from "../../services/resourceProcessing.service";
import { getTitleAndSubjectFromText } from "../../services/topicExtraction.service";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import validate from "../../utils/validation";

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

const StartTopicWithResources = asyncHandler(
  async (req: Request, res: Response) => {
    const { data, success, error } = validate(
      StartTopicWithResourcesSchema,
      req.body ?? {},
    );
    if (!success) {
      const message = error.issues?.[0]?.message || "Validation failed";
      throw CustomError(400, message);
    }

    const { sourceIds, userMessage } = data;
    const userId = req.user!.id;

    // All slow I/O happens BEFORE the transaction opens
    const extracted = await extractAllSourcesText(sourceIds, userId);
    const { title, subject } = await getTitleAndSubjectFromText(
      extracted.map((e) => e.text),
    );
    const embeddedChunks = await embedAllChunks(extracted);

    // Transaction is now just fast, atomic DB writes
    const result = await db.transaction(async (tx) => {
      const { topic, session, message } =
        await createTopicWithSessionAndMessage(
          { userId, title, subject, userMessage },
          tx,
        );

      const chunkRows = embeddedChunks.map((c) => ({
        topicId: topic.id,
        sourceId: c.sourceId,
        userId,
        chunkIndex: c.chunkIndex,
        chunkText: c.chunkText,
        embedding: c.embedding,
      }));

      await insertChunks(chunkRows, tx);

      return { topic, session, message };
    });

    return res
      .status(201)
      .json(
        new APIResponse("Topic created from resources successfully", result),
      );
  },
);

export { DeleteTopic, GetTopic, GetTopics, UpdateTopic, StartTopicWithResources };
