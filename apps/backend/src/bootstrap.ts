import { Hono } from 'hono/tiny';
import beNiceMiddleware from './middlewares/be-nice-middleware';

export function getServer() {
  const app = new Hono();

  app.use('*', beNiceMiddleware());

  return app;
}
