import { Router } from "express";
import {
    DeleteTopic,
    GetTopic,
    GetTopics,
    StartTopicWithResources,
    UpdateTopic,
} from "../../controllers/topic/topic.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.use(authGuard, attachUser);

router.get("/", GetTopics);
router.get("/:id", GetTopic);
router.patch("/:id", UpdateTopic);
router.delete("/:id", DeleteTopic);
router.post("/start-with-resources", StartTopicWithResources);

export default router;
