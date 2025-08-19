import express from "express";
import requireAuth from "../middlewares/requireAuth";
import {
  buyItemInDailyMarket,
  buyItemInMarket,
  deleteItemInMarket,
  getDailyMarket,
  getMarket,
  getUserInventory,
  sellItemInMarket,
} from "../controllers/end-of-the-world";

const router = express.Router();

router.get("/getUserInventory", requireAuth, getUserInventory);
router.get("/getDailyMarket", requireAuth, getDailyMarket);
router.post("/buyItemInDailyMarket", requireAuth, buyItemInDailyMarket);
router.post("/buyItemInMarket", requireAuth, buyItemInMarket);
router.post("/sellItemInMarket", requireAuth, sellItemInMarket);
router.get("/getMarket", requireAuth, getMarket);
router.post("/deleteItemInMarket", requireAuth, deleteItemInMarket);

export default router;
