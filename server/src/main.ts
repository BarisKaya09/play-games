import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";

import router from "./router/router.ts";
import { DailyMarketRepository } from "./repository/mongodb/end-of-the-world/daily-market.ts";
import chalk from "chalk";

const main = async () => {
  dotenv.config({ path: ".env" });

  const app = express();

  const port = process.env.PORT || 3000;

  app.use(
    cors({
      credentials: true,
      origin: true,
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api", router);

  app.listen(port, () => {
    console.log(chalk.bgRedBright(chalk.green(`Sunucu http://localhost:${port} portunda başarılı bir şekilde başlatıldı!`)));
  });

  //? her gün saat 12:00 da "daily-market" güncellenecek.
  cron.schedule("00 12 * * *", async () => {
    try {
      const dailyMarketRepo = new DailyMarketRepository(process.env.MONGODB_URI as string);
      const dailyMarket = await dailyMarketRepo.findDailyMarket();

      if (dailyMarket) {
        await dailyMarketRepo.deleteDailyMarket({ id: dailyMarket.id });
        console.info(chalk.bgCyan(`[ ${new Date().toString()} ] Bir önceki günlük market silindi!`));
      }

      await dailyMarketRepo.insertDailyMarket();
      console.info(chalk.bgCyan(`[ ${new Date().toString()} ] Günlük market yenilendi!`));

      await dailyMarketRepo.close();
    } catch (err: any) {
      throw err;
    }
  });
};

await main();
