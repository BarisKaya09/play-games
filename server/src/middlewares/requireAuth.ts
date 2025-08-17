import express from "express";
import jwt from "jsonwebtoken";
import { UNAUTHORIZED } from "../lib/response";

const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.cookies.token as string;
    jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    next();
  } catch (err: any) {
    res.status(UNAUTHORIZED.status).json(UNAUTHORIZED);
  }
};

export default requireAuth;
