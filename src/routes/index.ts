import { Router } from "express";
import localAuthRoutes from "./auth/auth.routes";

const router = Router();

router.use("/auth", localAuthRoutes);

export default router;
