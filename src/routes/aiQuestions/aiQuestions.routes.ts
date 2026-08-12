import { Router } from "express";
import {
  GetSessionQuestions,
  GetAiQuestion,
  DeleteAiQuestion,
} from "../../controllers/aiQuestions/aiQuestions.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.use(authGuard, attachUser);

router.get("/session/:sessionId", GetSessionQuestions);
router.get("/:id", GetAiQuestion);
router.delete("/session/:sessionId/:id", DeleteAiQuestion);

export default router;