import { Router } from "express";
import {
  StartSession,
  GetSessions,
  GetSession,
  UpdateTranscript,
  EndSession,
  DeleteSession,
} from "../../controllers/session/session.controller";
import authGuard from "../../middleware/auth.middleware";
import attachUser from "../../middleware/user.middleware";

const router = Router();

router.use(authGuard, attachUser);

router.post("/", StartSession);
router.get("/", GetSessions);
router.get("/:id", GetSession);
router.patch("/:id/transcript", UpdateTranscript);
router.patch("/:id/end", EndSession);
router.delete("/:id", DeleteSession);

export default router;