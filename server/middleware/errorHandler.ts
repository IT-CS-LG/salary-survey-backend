import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(400).json({
      error: 'Database error',
      message: error.message
    });
    return;
  }

  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
  return;
}; 