import { Router } from "express";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";
import { CreateVoiceToken } from "../../controllers/voice/voice.controller";

const router = Router();

router.post("/token", authGuard, attachUser, CreateVoiceToken);

export default router;
