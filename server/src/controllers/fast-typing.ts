import express from "express";
import { ANY_ERROR, StatusCode, USER_NOT_EXIST, type SuccessResponse } from "../lib/response";
import { UserRepository, type FastTypingGameStatistics } from "../repository/mongodb/user";

export const getWords = async (req: express.Request, res: express.Response) => {
  try {
    const file = Bun.file("./src/controllers/words.txt");
    const textList = (await file.text()).split("\n");
    const words: Array<string> = [];

    for (let i = 0; i < 70; i++) {
      words.push(textList[Math.floor(Math.random() * textList.length)]);
    }

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: words } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const saveStatistics = async (req: express.Request, res: express.Response) => {
  try {
    type StatisticsBody = { correctWords: number; wrongWords: number };
    const { correctWords, wrongWords }: StatisticsBody = req.body as StatisticsBody;

    const userRepo = new UserRepository(process.env.MONGODB_URI as string);
    const username = req.cookies.username as string;
    const user = await userRepo.findUser({ username: username });

    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const totalCorrectWords = user.fastTyping.correctWords + correctWords;
    const totalWrongWords = user.fastTyping.wrongWords + wrongWords;
    const newFastTypingStatistics = {
      correctWords: totalCorrectWords,
      wrongWords: totalWrongWords,
      wpm: (totalCorrectWords + totalWrongWords) / 1, // 1'e bölünme sebebi 60sn 1 dakika olması. 1 dakika başına dülen kelime sayısı toplam kelime sayısıdır zaten.
      totalWordAccuracy: Math.floor((totalCorrectWords / (totalCorrectWords + totalWrongWords)) * 100),
    } as FastTypingGameStatistics;

    await userRepo.updateOne({ username: username }, { $set: { fastTyping: newFastTypingStatistics } });

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "İstatistikler kaydedildi!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const getStatistics = async (req: express.Request, res: express.Response) => {
  try {
    const username = req.cookies.username as string;
    const userRepo = new UserRepository(process.env.MONGODB_URI as string);

    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: user.fastTyping } as SuccessResponse);

    await userRepo.close();
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};
