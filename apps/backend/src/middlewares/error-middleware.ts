import { ErrorHandler } from 'hono';
import BaseError from '../utils/errors/base-error';
import { log } from '../utils/logger';

export default function errorMiddleware(): ErrorHandler {
  return (error, ctx) => {
    if (error instanceof BaseError) {
      ctx.status(error.statusCode);
      return ctx.json({
        data: null,
        message: error.message,
        error: {
          code: error.code,
          action: error.action,
          additionalData: error.additionalData,
        },
      });
    } else {
      // We probably want to log this error to some error tracking service
      log.error(error);
      ctx.status(500);
      return ctx.json({
        data: null,
        message: 'Internal server error.',
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          action: 'Please try again later.',
          additionalData: null,
        },
      });
    }
  };
}
