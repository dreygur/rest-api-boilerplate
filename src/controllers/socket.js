import { Server } from 'socket.io';

/**
 * Initializes a Socket.IO server with the provided HTTP server instance,
 * options, and event handlers.
 *
 * @param {http.Server} server - The HTTP server instance to attach the
 *   Socket.IO server to.
 * @param {Object} events - An object that maps event names to handler
 *   functions and properties. The properties include any additional
 *   metadata that the handler functions might need to process the event.
 * @param {Object} options - An object containing any Socket.IO server options
 *   to configure the server instance. This can include things like the CORS
 *   configuration, whether to allow binary data, etc.
 * @returns {SocketIO.Server} - The initialized Socket.IO server instance.
 */
export default function start(server, options) {
  const io = new Server(server, {
    cors: {
      origin: options.origin,
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  console.log('=> Socket.io initialized');
  return io;
}

/**
 * Registers all the event handlers for the provided Socket.IO server
 * instance and attaches them to the appropriate events.
 *
 * @param {SocketIO.Server} io - The Socket.IO server instance to register
 *   the event handlers for.
 * @param {Object} events - An object that maps event names to handler
 *   functions and properties. The properties include any additional
 *   metadata that the handler functions might need to process the event.
 */
export function listen(io, events, ...middlewares) {
  (new Promise((resolve) => {
    for (let i in middlewares) {
      io.use(i);
    }

    resolve();
  })).then(() => {
    io.on('connection', async ws => {
      console.log('Connected =>', ws.id);
      ws.on('disconnect', () => console.log('Diconnected =>', ws.id));

      ws.onAny((event, ...args) => {
        events[event]?.method({ data: args[0], session: ws, ...events[event]?.props });
      });
    });

    console.log('=> Registered all event handlers');
  })
    .catch(e => console.log(`[-] ${e.message}`));
}