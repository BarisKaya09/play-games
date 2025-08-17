import express from "express";
import { getStatistics, getWords, saveStatistics } from "../controllers/fast-typing";
import requireAuth from "../middlewares/requireAuth";

const router = express.Router();

router.get("/get-words", getWords);
router.post("/saveStatistics", requireAuth, saveStatistics);
router.get("/getStatistics", requireAuth, getStatistics);

export default router;
