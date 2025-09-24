import express from "express";
import { ANY_ERROR, MISSING_CONTENT, StatusCode, USER_NOT_EXIST, type SuccessResponse } from "../lib/response";
import { UserRepository, type SnakeGameRecordStatistics } from "../repository/mongodb/user";

export const saveSnakeGameRecordStatistics = async (req: express.Request, res: express.Response) => {
  try {
    const { playTime, appleCount, wallCount }: SnakeGameRecordStatistics = req.body as SnakeGameRecordStatistics;

    if (!playTime || !appleCount || !wallCount) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    const userRepo = new UserRepository();
    const username = req.cookies.username as string;

    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    if (user.snakeGameRecord.appleCount >= appleCount) {
      res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Rekorunuzu kıramadınız!" } as SuccessResponse);
      return;
    }

    const newSnakeGameRecord = {
      playTime,
      appleCount,
      wallCount,
    } as SnakeGameRecordStatistics;

    await userRepo.updateOne({ username: user.username }, { $set: { snakeGameRecord: newSnakeGameRecord } });

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Yeni rekorunuz kaydedildi!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const getSnakeGameRecord = async (req: express.Request, res: express.Response) => {
  try {
    const userRepo = new UserRepository();
    const username = req.cookies.username as string;

    const user = await userRepo.findUser({ username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: user.snakeGameRecord } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};
