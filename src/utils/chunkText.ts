const CHUNK_SIZE = 1500; // chars, not tokens — good enough for v1
const CHUNK_OVERLAP = 200;

export const chunkText = (text: string): string[] => {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const chunks: string[] = [];
  let start = 0;

  while (start < cleaned.length) {
    const end = Math.min(start + CHUNK_SIZE, cleaned.length);
    chunks.push(cleaned.slice(start, end));
    if (end === cleaned.length) break;
    start = end - CHUNK_OVERLAP;
  }

  return chunks;
};