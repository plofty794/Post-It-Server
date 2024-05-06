import { ErrorRequestHandler } from 'express';
import { isHttpError } from 'http-errors';
import { ZodError, ZodIssue } from 'zod';

export const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  if (err instanceof ZodError) {
    const errorMessages = err.errors.map((issue: ZodIssue) => ({
      message: `${issue.path.join('.')} is ${issue.message.toLowerCase()}`,
    }));
    return res.status(400).json({ error: 'Invalid data', details: errorMessages });
  }
  if (isHttpError(err)) {
    return res.status(err.status).json({ error: err.message });
  }
  res.status(500).json({ error: 'Unknown error occurred.', message: err.message });
};
