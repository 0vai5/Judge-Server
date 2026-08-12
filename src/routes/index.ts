import { Router } from "express";
import localAuthRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import topicRoutes from "./topic/topic.routes";
import voiceRoutes from "./voice/voice.routes";
import sessionRoutes from "./session/session.routes";
import scoreRoutes from "./score/score.routes";
import aiQuestionRoutes from "./aiQuestions/aiQuestions.routes";
import transcriptMessageRoutes from "./transcriptMessage/transcriptMessage.routes";

const router = Router();

router.use("/auth", localAuthRoutes);
router.use("/user", userRoutes);
router.use("/topic", topicRoutes);
router.use("/voice", voiceRoutes);
router.use("/session", sessionRoutes);
router.use("/score", scoreRoutes);
router.use("/aiQuestions", aiQuestionRoutes);
router.use("/transcriptMessages", transcriptMessageRoutes);

export default router;
