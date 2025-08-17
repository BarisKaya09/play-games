import express from "express";
import { isLoggedIn, logout, signin, signup } from "../controllers/auth";
import requireAuth from "../middlewares/requireAuth";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", requireAuth, logout);
router.get("/isLoggedIn", requireAuth, isLoggedIn);

export default router;
