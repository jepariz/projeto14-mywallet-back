import { newEntry, getEntries } from "../controllers/entriesControllers.js";

import { Router } from "express";

const router = Router();

router.post("/transacoes", newEntry);

router.get("/transacoes", getEntries);

export default router;
