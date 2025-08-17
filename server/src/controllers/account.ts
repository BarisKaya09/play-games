import express from "express";
import {
  ANY_ERROR,
  INVALID_MAIL_ADDR,
  MISSING_CONTENT,
  SAME_EMAIL,
  SAME_USERNAME,
  StatusCode,
  USER_NOT_EXIST,
  type SuccessResponse,
} from "../lib/response";
import { UserRepository } from "../repository/mongodb/user";
import jwt from "jsonwebtoken";
import validator from "validator";

export const getAccount = async (req: express.Request, res: express.Response) => {
  try {
    const username = req.cookies.username as string;
    const userRepo = new UserRepository(process.env.MONGODB_URI as string);

    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    const account = { username: user.username, email: user.email };
    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: account } as SuccessResponse);

    await userRepo.close();
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const changeUsername = async (req: express.Request, res: express.Response) => {
  try {
    const { newUsername }: { newUsername: string } = req.body;

    console.log(newUsername);
    if (!newUsername) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    const username = req.cookies.username as string;
    const userRepo = new UserRepository(process.env.MONGODB_URI as string);

    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    if (user.username == newUsername) {
      res.status(SAME_USERNAME.status).json(SAME_USERNAME);
      return;
    }

    await userRepo.updateOne({ username: username }, { $set: { username: newUsername } });
    await userRepo.close();

    const newToken = jwt.sign({ username }, process.env.JWT_SECRET_KEY as string, { expiresIn: "2h" });

    res.cookie("token", newToken, { httpOnly: true, maxAge: 3600000, secure: true });
    res.cookie("username", newUsername, { httpOnly: true, maxAge: 3600000, secure: true });
    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Kullanıcı adı değiştirildi!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const changeEmail = async (req: express.Request, res: express.Response) => {
  try {
    const { newEmail }: { newEmail: string } = req.body;

    if (!newEmail) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    if (!validator.isEmail(newEmail)) {
      res.status(INVALID_MAIL_ADDR.status).json(INVALID_MAIL_ADDR);
      return;
    }

    const username = req.cookies.username as string;
    const userRepo = new UserRepository(process.env.MONGODB_URI as string);

    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    if (user.email == newEmail) {
      res.status(SAME_EMAIL.status).json(SAME_EMAIL);
      return;
    }

    await userRepo.updateOne({ username: username }, { $set: { email: newEmail } });
    await userRepo.close();

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Email adresi değiştirildi!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};
