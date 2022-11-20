import { registerUser, userSignIn } from "../controllers/usersControllers.js";

import { Router } from "express";

const router = Router();

router.post("/registro", registerUser);

router.post("/", userSignIn);

export default router;
