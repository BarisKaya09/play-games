import express from "express";
import requireAuth from "../middlewares/requireAuth";
import { changeEmail, changeUsername, getAccount } from "../controllers/account";

const router = express.Router();

router.post("/changeUsername", requireAuth, changeUsername);
router.post("/changeEmail", requireAuth, changeEmail);
router.get("/getAccount", requireAuth, getAccount);

export default router;
