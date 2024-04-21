import Bun from 'bun';
import { randomUUID } from 'crypto';
import socket from './socket';

import './registry';

Bun.serve({
  fetch(request, server) {
    const upgrated = server.upgrade(request, {
      data: { userId: randomUUID() },
    });

    if (upgrated) {
      return;
    }

    return new Response('Failed to upgrade', { status: 500 });
  },
  port: 3000,
  websocket: {
    open: socket.open.bind(socket),
    message: socket.message.bind(socket),
    close: socket.close.bind(socket),
    drain(ws) {},
  },
});
