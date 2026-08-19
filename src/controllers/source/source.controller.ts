import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import CustomError from "http-errors";
import { S3_BUCKET, s3Client } from "../../config/s3";
import { createSource } from "../../dbActions/source.actions";
import { PresignRequestSchema } from "../../schemas/source.schema";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import validate from "../../utils/validation";

const GetPresignedUrls = asyncHandler(async (req: Request, res: Response) => {
  const { data, success, error } = validate(PresignRequestSchema, req.body);
  if (!success) {
    const message = error.issues?.[0]?.message || "Validation failed";
    throw CustomError(400, message);
  }

  const userId = req.user!.id;

  const results = await Promise.all(
    data.files.map(async (file) => {
      const s3Key = `resources/${userId}/${randomUUID()}-${file.name}`;

      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: s3Key,
        ContentType: file.contentType,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 300,
      });

      const source = await createSource({
        name: file.name,
        size: file.size,
        s3Key,
        contentType: file.contentType,
        userId,
      });

      return {
        sourceId: source?.id,
        presignedUrl,
        s3Key,
      };
    }),
  );

  return res
    .status(200)
    .json(
      new APIResponse("Presigned URLs generated successfully", {
        sources: results,
      }),
    );
});

export { GetPresignedUrls };
