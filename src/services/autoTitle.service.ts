import CustomError from "http-errors";
import { openAIClient, OPENROUTER_CHAT_MODEL } from "../config/openAI";
import { updateTopicBySessionID } from "../dbActions/topic.actions";
import { Subject } from "../schemas/topic.schema";

interface TopicGenerationResponse {
  title: string;
  subject: Subject;
}

const validSubjects: Subject[] = [
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
];

export const generateTopicTitle = async (
  sessionId: string,
  userId: string,
  firstUserMessage: string,
): Promise<TopicGenerationResponse> => {
  const prompt = `
You are an expert educational tutor.

Analyze the student's first message and determine the main
learning topic and subject.

Student's first message:
<student_message>
${firstUserMessage}
</student_message>

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

  const response = await openAIClient.chat.completions.create({
    model: OPENROUTER_CHAT_MODEL,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw CustomError(500, "OpenRouter returned an empty response");
  }

  let data: TopicGenerationResponse;

  try {
    data = JSON.parse(content);
  } catch {
    throw CustomError(500, "OpenRouter returned invalid JSON");
  }

  const { title, subject } = data;

  if (!title || !subject || !validSubjects.includes(subject)) {
    throw CustomError(500, "OpenRouter response missing title or subject");
  }

  const updatedTopic = await updateTopicBySessionID(sessionId, userId, {
    title: title,
    subject: subject,
  });

  if (!updatedTopic) {
    throw CustomError(500, "Failed to update topic");
  }

  return {
    title: updatedTopic.title!,
    subject: updatedTopic.subject!,
  };
};
