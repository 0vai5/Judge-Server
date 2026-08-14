import { Router } from "express";
import { GetPresignedUrls } from "../../controllers/source/source.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.use(authGuard, attachUser);

router.post("/presign", GetPresignedUrls);

export default router;