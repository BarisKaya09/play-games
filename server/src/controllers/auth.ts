import express from "express";
import validator from "validator";
import jwt from "jsonwebtoken";
import { v4 as uuidV4 } from "uuid";

import { UserRepository, type User } from "../repository/mongodb/user";
import {
  ANY_ERROR,
  INVALID_MAIL_ADDR,
  INVALID_PASSWORD_LEN,
  MISSING_CONTENT,
  StatusCode,
  USER_EXIST,
  USER_NOT_EXIST,
  WRONG_PASSWORD,
  type SuccessResponse,
} from "../lib/response";
import { comparePassword, hashPassword } from "../utils";
import { InventoryRepository } from "../repository/mongodb/end-of-the-world/inventory";

const MIN_PASSWORD_SIZE: number = 7;
const MAX_PASSWORD_SIZE: number = 50;

export const signup = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password }: User = req.body;

    if (!username || !email || !password) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    if (!validator.isEmail(email)) {
      res.status(INVALID_MAIL_ADDR.status).json(INVALID_MAIL_ADDR);
      return;
    }

    if (password.length < MIN_PASSWORD_SIZE || password.length > MAX_PASSWORD_SIZE) {
      res.status(INVALID_PASSWORD_LEN.status).json(INVALID_PASSWORD_LEN);
      return;
    }

    const userRepo = new UserRepository();

    const founded = await userRepo.findUser({ username: username });
    if (founded) {
      res.status(USER_EXIST.status).json(USER_EXIST);
      return;
    }

    const user_id = uuidV4();
    const hashedPassword = await hashPassword(password, 15);
    await userRepo.insertUser(user_id, username, email, hashedPassword);

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Kullanıcı eklendi!" } as SuccessResponse);

    const inventoryRepo = new InventoryRepository();
    await inventoryRepo.insertInventory(user_id);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const signin = async (req: express.Request, res: express.Response) => {
  try {
    type LoginBody = { username: string; password: string };
    const { username, password }: LoginBody = req.body;

    if (!username || !password) {
      res.status(MISSING_CONTENT.status).json(MISSING_CONTENT);
      return;
    }

    const userRepo = new UserRepository();

    const user = await userRepo.findUser({ username: username });
    if (!user) {
      res.status(USER_NOT_EXIST.status).json(USER_NOT_EXIST);
      return;
    }

    if (!(await comparePassword(password, user.password))) {
      res.status(WRONG_PASSWORD.status).json(WRONG_PASSWORD);
      return;
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET_KEY as string, { expiresIn: "2h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000, secure: true });
    res.cookie("username", username, { httpOnly: true, maxAge: 3600000, secure: true });

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Giriş yapıldı!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const logout = (_: express.Request, res: express.Response) => {
  try {
    res.clearCookie("token");
    res.clearCookie("username");

    res.status(StatusCode.OK).json({ status: StatusCode.OK, data: "Çıkış yapıldı!" } as SuccessResponse);
  } catch (err: any) {
    res.status(ANY_ERROR.status).json(ANY_ERROR);
  }
};

export const isLoggedIn = (_: express.Request, res: express.Response) => {
  res.status(StatusCode.OK).json({ status: StatusCode.OK, data: true } as SuccessResponse);
};
