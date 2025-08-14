import { Server } from 'socket.io';
import Message from './models/Message.js';

export const initSocket = (httpServer, corsOrigin) => {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ workshopId, userId }) => {
      socket.join(workshopId);
      socket.data.userId = userId;
    });

    socket.on('message', async ({ workshopId, userId, text }) => {
      if (!text?.trim()) return;
      const msg = await Message.create({ workshop: workshopId, sender: userId, text });
      io.to(workshopId).emit('message', {
        _id: msg._id, workshop: workshopId, sender: userId, text: msg.text, createdAt: msg.createdAt
      });
    });

    socket.on('disconnect', () => {});
  });

  return io;
};
