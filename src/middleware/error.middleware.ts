import { NextFunction, Request, Response } from "express";
import { APIError } from "../utils/response";

// TODO: Fix Error Middleware

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (res.headersSent) {
    return;
  }

  // Log error for debugging
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle different types of errors
  let statusCode = 500;
  let errorMessage = "Internal Server Error";

  // Handle HTTP errors from http-errors package
  if (error.status || error.statusCode) {
    statusCode = error.status || error.statusCode;
    errorMessage = error.message;
  }
  // Handle validation errors
  else if (error.name === "ValidationError") {
    statusCode = 400;
    errorMessage = error.message;
  }
  // Handle MongoDB duplicate key errors
  else if (error.code === 11000) {
    statusCode = 400;
    errorMessage = "Duplicate field value entered";
  }
  // Handle MongoDB cast errors
  else if (error.name === "CastError") {
    statusCode = 400;
    errorMessage = "Invalid ID format";
  }
  // Handle JWT errors
  else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    errorMessage = "Invalid token";
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    errorMessage = "Token expired";
  }
  // Handle custom errors
  else if (error.message) {
    errorMessage = error.message;
  }

  res.status(statusCode).json(new APIError(errorMessage));
};

export default errorHandler;