import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import { geminiClient, GEMINI_LIVE_MODEL } from "../../config/gemini";
import { Modality } from "@google/genai";

const CreateVoiceToken = asyncHandler(async (req: Request, res: Response) => {
  const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

  const token = await geminiClient.authTokens.create({
    config: {
      uses: 1, // The default
      expireTime: expireTime, // Default is 30 mins
      newSessionExpireTime: new Date(Date.now() + 1 * 60 * 1000).toISOString(), // Default 1 minute in the future
      liveConnectConstraints: {
        model: GEMINI_LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
        },
      },
    },
  });

  return res.status(200).json(
    new APIResponse("Voice token created successfully", {
      token: token.name,
    }),
  );
});
export { CreateVoiceToken };
