import { GetObjectCommand } from "@aws-sdk/client-s3";
import pdfParse from "pdf-parse"
import mammoth from "mammoth";
import { s3Client, S3_BUCKET } from "../config/s3";

const streamToBuffer = async (stream: any): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const downloadFromS3 = async (s3Key: string): Promise<Buffer> => {
  const command = new GetObjectCommand({ Bucket: S3_BUCKET, Key: s3Key });
  const response = await s3Client.send(command);
  if (!response.Body) throw new Error(`Empty S3 object body for key: ${s3Key}`);
  return streamToBuffer(response.Body);
};

export const extractTextFromSource = async (
  s3Key: string,
  contentType: string,
): Promise<string> => {
  const buffer = await downloadFromS3(s3Key);

  if (contentType === "application/pdf") {
    const result = await pdfParse(buffer);
    return result.text;
  }

  if (
    contentType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (contentType.startsWith("text/")) {
    return buffer.toString("utf-8");
  }

  throw new Error(`Unsupported content type for extraction: ${contentType}`);
};