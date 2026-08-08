import { NextFunction, Request, Response } from "express";
import CustomError from "http-errors";
import { findUserById } from "../dbActions/user.actions";

const attachUser = async (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  if (!userId) {
    return next();
  }

  try {
    const user = await findUserById(userId);

    if (!user) {
      return next(CustomError(401, "User not found"));
    }

    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default attachUser;
