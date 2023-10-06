import { getServer } from './bootstrap';

console.log('Starting server...');

const server = getServer();

Bun.serve({
  fetch: server.fetch,
  port: process.env.PORT || 3001,
});

console.log(`Wiki server started on ${process.env.PORT || 3001}`);
