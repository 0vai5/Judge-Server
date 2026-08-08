import { Request, Response } from "express";
import CustomError from "http-errors";
import asyncHandler from "../../utils/asyncHandler";
import { APIResponse } from "../../utils/response";
import { findUserById } from "../../dbActions/user.actions";

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw CustomError(401, "Unauthorized");
  }

  const user = await findUserById(userId);

  if (!user || user.isDeleted) {
    throw CustomError(404, "User not found");
  }

  if (!user.isActive) {
    throw CustomError(403, "Account is not active");
  }

  res.status(200).json(
    new APIResponse("User profile fetched successfully", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    }),
  );
});

export { getCurrentUser };
