import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    code: err.code,
    name: err.name
  });

  if (err.name === 'PrismaClientInitializationError') {
    return res.status(500).json({
      error: 'Database connection error',
      details: 'Could not connect to the database. Please check environment variables.'
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}; 