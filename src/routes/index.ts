import { Router } from "express";
import localAuthRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import topicRoutes from "./topic/topic.routes";

const router = Router();

router.use("/auth", localAuthRoutes);
router.use("/user", userRoutes);
router.use("/topic", topicRoutes);

export default router;
