import { Server } from 'socket.io';

/**
 * This function initializes a new Socket.IO server and sets up connection and disconnection event listeners
 *
 * @async
 * @param {object} server - The server object to attach the Socket.IO server to
 * NOTE: Entity function name should match with the event name you are giving.
 */
export default function start(server, options) {
  const io = new Server(server, {
    cors: {
      origin: options.origin,
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', async ws => {
    console.log('Connected =>', ws.id);

    ws.on('disconnect', () => {
      console.log('Diconnected =>', ws.id);
    });
  });
  console.log('=> Socket io initialized');
  return io;
}