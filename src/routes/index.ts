import { Router } from "express";
import localAuthRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import topicRoutes from "./topic/topic.routes";
import voiceRoutes from "./voice/voice.routes";

const router = Router();

router.use("/auth", localAuthRoutes);
router.use("/user", userRoutes);
router.use("/topic", topicRoutes);
router.use("/voice", voiceRoutes);

export default router;
