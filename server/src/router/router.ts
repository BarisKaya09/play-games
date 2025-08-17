import express from "express";

import fastTypingRouter from "./fast-typing.ts";
import authRouter from "./auth.ts";
import accountRouter from "./account.ts";
import snakeGameRouter from "./snake-game.ts";
import endOfTheWorldRouter from "./end-of-the-world.ts";

const router = express.Router();

router.use("/fast-typing", fastTypingRouter);
router.use("/auth", authRouter);
router.use("/account", accountRouter);
router.use("/snake-game", snakeGameRouter);
router.use("/end-of-the-world", endOfTheWorldRouter);

export default router;
