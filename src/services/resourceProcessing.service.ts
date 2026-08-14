import { extractTextFromSource } from "./extraction.service";
import { chunkText } from "../utils/chunkText";
import { insertChunks } from "../dbActions/topicResource.actions";
import { findSourceById } from "../dbActions/source.action";
// ⚠️ ADJUST THIS IMPORT to match your actual embedding.service.ts export name/signature
import { generateEmbeddings } from "./embedding.service";

type ProcessedSource = {
  sourceId: string;
  extractedText: string;
  chunkCount: number;
};

export const processSource = async (
  sourceId: string,
  topicId: string,
  userId: string,
): Promise<ProcessedSource> => {
  const source = await findSourceById(sourceId, userId);
  if (!source)
    throw new Error(`Source not found or not owned by user: ${sourceId}`);

  const extractedText = await extractTextFromSource(
    source.s3Key,
    source.contentType,
  );
  const chunks = chunkText(extractedText);

  if (chunks.length === 0) {
    return { sourceId, extractedText: "", chunkCount: 0 };
  }

  const chunkRows = await Promise.all(
    chunks.map(async (text, index) => ({
      topicId,
      sourceId,
      userId,
      chunkIndex: index,
      chunkText: text,
      embedding: await generateEmbeddings(text),
    })),
  );

  await insertChunks(chunkRows);

  return { sourceId, extractedText, chunkCount: chunks.length };
};

export const processAllSources = async (
  sourceIds: string[],
  topicId: string,
  userId: string,
): Promise<string> => {
  const results = await Promise.all(
    sourceIds.map((id) => processSource(id, topicId, userId)),
  );
  // Combined text goes into the topic-name/subject extraction prompt next
  return results.map((r) => r.extractedText).join("\n\n");
};
