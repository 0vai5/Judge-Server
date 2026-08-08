import { Router } from "express";
import localAuthRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";

const router = Router();

router.use("/auth", localAuthRoutes);
router.use("/user", userRoutes);

export default router;
