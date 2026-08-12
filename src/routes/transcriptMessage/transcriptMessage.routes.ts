import { Router } from "express";
import {
  CreateMessage,
  GetSessionMessages,
} from "../../controllers/transcriptMessage/transcriptMessage.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.use(authGuard, attachUser);

router.post("/session/:sessionId", CreateMessage);
router.get("/session/:sessionId", GetSessionMessages);

export default router;