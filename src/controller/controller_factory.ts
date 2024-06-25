import { onError } from '@/error/error_handlers.js';
import { Request, Response } from 'express';

// error handling by default
export function createAsyncController<T>(
  tryBlock: (req: Request, res: Response<T>) => Promise<void>
) {
  return async (req: Request, res: Response<T>) => {
    try {
      await tryBlock(req, res);
    } catch (err: unknown) {
      onError(res, err);
    }

    if (!res.headersSent) {
      res.sendStatus(500);
    }
  };
}
