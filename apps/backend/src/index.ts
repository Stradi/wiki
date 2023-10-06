import { getServer } from './bootstrap';
import { log } from './utils/logger';

log.info('Welcome to the WIKI Backend!');

const server = getServer();

Bun.serve({
  fetch: server.fetch,
  port: process.env.PORT || 3001,
});

log.info(`WIKI Backend API started on http://localhost:${process.env.PORT || 3001}`);
