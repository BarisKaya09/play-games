import express from "express";
import requireAuth from "../middlewares/requireAuth";
import {
  buyItemInDailyMarket,
  buyItemInMarket,
  concatItems,
  deleteItemInMarket,
  getDailyMarket,
  getItemInDailyMarketByName,
  getMap,
  getMarket,
  getUserInventory,
  sellItemInMarket,
  splitItemStack,
  stacKTheItemInInventory,
  useItem,
} from "../controllers/end-of-the-world";

const router = express.Router();

router.get("/getUserInventory", requireAuth, getUserInventory);
router.get("/getDailyMarket", requireAuth, getDailyMarket);
router.post("/buyItemInDailyMarket", requireAuth, buyItemInDailyMarket);
router.post("/buyItemInMarket", requireAuth, buyItemInMarket);
router.post("/sellItemInMarket", requireAuth, sellItemInMarket);
router.get("/getMarket", requireAuth, getMarket);
router.post("/deleteItemInMarket", requireAuth, deleteItemInMarket);
router.post("/stacKTheItemInInventory", requireAuth, stacKTheItemInInventory);
router.post("/splitItemStack", requireAuth, splitItemStack);
router.post("/concatItems", requireAuth, concatItems);
router.get("/getMap", requireAuth, getMap);
router.post("/useItem", requireAuth, useItem);

// dev. routes
router.get("/getItemInDailyMarketByName/:itemName", requireAuth, getItemInDailyMarketByName);

export default router;
