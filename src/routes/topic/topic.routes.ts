import { Router } from "express";
import {
  StartTopic,
  GetTopics,
  GetTopic,
  UpdateTopic,
  DeleteTopic,
} from "../../controllers/topic/topic.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.use(authGuard, attachUser);

router.post("/", StartTopic);
router.get("/", GetTopics);
router.get("/:id", GetTopic);
router.patch("/:id", UpdateTopic);
router.delete("/:id", DeleteTopic);

export default router;
