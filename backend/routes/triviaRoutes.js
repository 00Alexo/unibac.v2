const { Server } = require('socket.io');
const wsController = require('../controllers/triviaController');

module.exports = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.ORIGIN_TRIVIA,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  wsController(io);
};