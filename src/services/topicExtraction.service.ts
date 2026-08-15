import CustomError from "http-errors";
import { Subject } from "../schemas/topic.schema";
import { callWithFallback } from "./openAI.service";

interface TopicGenerationResponse {
  title: string;
  subject: Subject;
}

const validSubjects: Subject[] = [
  "math", "science", "history", "language", "general", "chemistry",
  "physics", "biology", "geography", "economics", "political science",
  "psychology", "sociology", "philosophy", "art", "music",
  "physical education", "computer science",
];

export const getTitleAndSubjectFromText = async (texts: string[]) => {
  const content = texts
    .map((text, index) => `Resource ${index + 1}:\n${text}`)
    .join("\n\n");

  const prompt = `
You are an expert educational tutor.

Analyze the resource's text content and determine the main
learning topic and subject.

Extracted Content:
<extractedContent>
${content}
</extractedContent>

Generate a concise and meaningful topic title.

Requirements:
- It should describe what the student is trying to learn.
- Do not include unnecessary words.
- Do not include explanations.

Subject must be exactly one of:
math, science, history, language, general,
chemistry, physics, biology, geography, economics,
political science, psychology, sociology, philosophy,
art, music, physical education, computer science.

If the subject cannot confidently be determined, use "general".

Return ONLY valid JSON:

{
  "title": "string",
  "subject": "string"
}
`;

  const response = await callWithFallback(prompt);
  if (!response) {
    throw CustomError(500, "OpenRouter returned an empty response");
  }

  const cleaned = response.replace(/```json|```/g, "").trim();

  let data: TopicGenerationResponse;
  try {
    data = JSON.parse(cleaned);
  } catch {
    throw CustomError(500, "OpenRouter returned invalid JSON");
  }

  const { title, subject } = data;
  if (!title || !subject || !validSubjects.includes(subject)) {
    throw CustomError(500, "OpenRouter response missing title or subject");
  }

  return { title, subject };
};