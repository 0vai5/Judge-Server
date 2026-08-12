import { Router } from "express";
import {
    DeleteSession,
    EndSession,
    GetSession,
    GetSessions,
    StartSession,
} from "../../controllers/session/session.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.use(authGuard, attachUser);

router.post("/", StartSession);
router.get("/", GetSessions);
router.get("/:id", GetSession);
router.patch("/:id/end", EndSession);
router.delete("/:id", DeleteSession);

export default router;
