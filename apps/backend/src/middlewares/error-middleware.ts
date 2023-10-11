import { ErrorHandler } from 'hono';
import BaseError from '../utils/errors/base-error';
import { log } from '../utils/logger';
import { ResponseStatus, resp } from '../utils/response';

export default function errorMiddleware(): ErrorHandler {
  return (error, ctx) => {
    if (error instanceof BaseError) {
      const responseObj = resp({
        status: error.statusCode,
        data: {
          code: error.code,
          message: error.message,
          action: error.action,
        },
      });
      ctx.status(error.statusCode);
      return ctx.json(responseObj);
    } else {
      const responseObj = resp({
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        data: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error.',
          action: 'Please try again later.',
        },
      });

      // We probably want to log this error to some error tracking service
      log.error(error);
      ctx.status(500);
      return ctx.json(responseObj);
    }
  };
}
