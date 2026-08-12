import { Router } from "express";
import { CreateScore, GetScore } from "../../controllers/score/score.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.use(authGuard, attachUser);

router.post("/", CreateScore);
router.get("/:sessionId", GetScore);

export default router;