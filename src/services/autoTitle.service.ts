// src/services/autoTitle.service.ts
import { updateTopic } from "../dbActions/topic.actions";

/**
 * TODO: Auto-generate a topic title from the first exchange of a session,
 * mirroring ChatGPT/Claude thread auto-naming UX (see PRD's "Topics
 * auto-creation pattern").
 *
 * BLOCKED: depends on reliable tool-calling / a text-channel response from
 * Gemini Live (see Day 5-6 investigation — audio-only modality doesn't
 * surface toolCall events, root cause still unconfirmed). This needs *some*
 * text-generating call to produce a short title from the first user
 * explanation — either:
 *   (a) a small OpenRouter call (same pattern as scoring.service.ts), or
 *   (b) a Gemini Live text-modality turn, once that's unblocked.
 *
 * Leaning toward (a) since it doesn't depend on the blocked investigation
 * at all — OpenRouter is already wired and separate from the live voice
 * layer by design (see PRD 2: "Gemini Live never does scoring, OpenRouter
 * never touches the live audio loop" — title generation is a post-hoc
 * reasoning task, same bucket as scoring).
 *
 * Trigger point: call this once, after the first user transcript message
 * for a topic's first session is logged — not on every message.
 */
export const generateTopicTitle = async (
  topicId: string,
  userId: string,
  firstUserMessage: string,
): Promise<void> => {
  // TODO: implement
  // 1. Call OpenRouter with a short prompt: summarize firstUserMessage into
  //    a 3-6 word title, same client/fallback pattern as scoring.service.ts
  // 2. updateTopic(topicId, userId, { title: generatedTitle })
  throw new Error("generateTopicTitle not yet implemented");
};