import { Router } from "express";
import { getCurrentUser } from "../../controllers/user/user.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.get("/profile", authGuard, attachUser, getCurrentUser);

export default router;
