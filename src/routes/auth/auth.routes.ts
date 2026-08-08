import {Router} from "express";
import { Login, Signup } from "../../controllers/auth/auth.controller";

const router = Router();

router.post("/login", Login);
router.post("/signup", Signup);

export default router;