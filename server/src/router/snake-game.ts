import express from "express";
import requireAuth from "../middlewares/requireAuth";
import { getSnakeGameRecord, saveSnakeGameRecordStatistics } from "../controllers/snake-game";

const router = express.Router();

router.post("/saveSnakeGameRecordStatistics", requireAuth, saveSnakeGameRecordStatistics);
router.get("/getSnakeGameRecord", requireAuth, getSnakeGameRecord);

export default router;
