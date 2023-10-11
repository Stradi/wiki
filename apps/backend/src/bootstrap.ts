import { Hono } from 'hono/tiny';
import beNiceMiddleware from './middlewares/be-nice-middleware';
import errorMiddleware from './middlewares/error-middleware';
import PageController from './modules/page/page-controller';

export function getServer() {
  const app = new Hono();

  app.use('*', beNiceMiddleware());
  app.onError(errorMiddleware());

  app.route('/api/v1/page', new PageController().router());

  return app;
}
