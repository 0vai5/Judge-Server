import { extractTextFromSource } from "./extraction.service";
import { chunkText } from "../utils/chunkText";
import { findSourceById } from "../dbActions/source.actions";
import { generateEmbeddings } from "./embedding.service";

type ExtractedSource = { sourceId: string; text: string };
type EmbeddedChunk = {
  sourceId: string;
  chunkIndex: number;
  chunkText: string;
  embedding: number[];
};

// Phase 1: download + extract text. No DB writes, no topicId needed.
export const extractAllSourcesText = async (
  sourceIds: string[],
  userId: string,
): Promise<ExtractedSource[]> => {
  return Promise.all(
    sourceIds.map(async (sourceId) => {
      const source = await findSourceById(sourceId, userId);
      if (!source) throw new Error(`Source not found or not owned by user: ${sourceId}`);
      const text = await extractTextFromSource(source.s3Key, source.contentType);
      return { sourceId, text };
    }),
  );
};

// Phase 2: chunk + embed. Still no DB writes — this is all network/CPU work,
// deliberately kept OUTSIDE the transaction that comes later.
export const embedAllChunks = async (
  extracted: ExtractedSource[],
): Promise<EmbeddedChunk[]> => {
  const all: EmbeddedChunk[] = [];

  for (const { sourceId, text } of extracted) {
    const chunks = chunkText(text);
    const embedded = await Promise.all(
      chunks.map(async (chunk, chunkIndex) => ({
        sourceId,
        chunkIndex,
        chunkText: chunk,
        embedding: await generateEmbeddings(chunk),
      })),
    );
    all.push(...embedded);
  }

  return all;
};