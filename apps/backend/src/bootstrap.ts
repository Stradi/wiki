import { Hono } from 'hono/tiny';
import beNiceMiddleware from './middlewares/be-nice-middleware';
import errorMiddleware from './middlewares/error-middleware';

export function getServer() {
  const app = new Hono();

  app.use('*', beNiceMiddleware());
  app.onError(errorMiddleware());

  return app;
}
