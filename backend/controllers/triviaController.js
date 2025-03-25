const { v4: uuidv4 } = require('uuid');

const lobbies = new Map();
const playerConnections = new Map();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    // Track player connection
    playerConnections.set(socket.id, { 
      lobbyId: null,
      username: null
    });

    // Lobby creation handler
    socket.on('createLobby', (username) => {
      const lobbyId = uuidv4().slice(0, 6).toUpperCase();
      const lobby = {
        id: lobbyId,
        players: [{ id: socket.id, username }],
        status: 'waiting'
      };
      
      // Update connection tracking
      playerConnections.set(socket.id, { 
        lobbyId,
        username
      });
      
      lobbies.set(lobbyId, lobby);
      socket.join(lobbyId);
      socket.emit('lobbyCreated', lobby);
      console.log(`Lobby created: ${lobbyId} by ${username}`);
    });

    // Lobby join handler
    socket.on('joinLobby', ({ lobbyId, username }) => {
      const lobby = lobbies.get(lobbyId);
      
      if (lobby && lobby.status === 'waiting') {
        lobby.players.push({ id: socket.id, username });
        
        // Update connection tracking
        playerConnections.set(socket.id, { 
          lobbyId,
          username
        });
        
        socket.join(lobbyId);
        io.to(lobbyId).emit('lobbyUpdated', lobby);
        console.log(`${username} joined lobby ${lobbyId}`);
      } else {
        socket.emit('joinError', 'Invalid lobby ID or game already started');
        console.log(`Failed join attempt for ${lobbyId} by ${username}`);
      }
    });

    // Disconnection handler
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      const connection = playerConnections.get(socket.id);
      
      if (connection?.lobbyId) {
        const lobby = lobbies.get(connection.lobbyId);
        
        if (lobby) {
          // Remove player from lobby
          lobby.players = lobby.players.filter(player => player.id !== socket.id);
          console.log(`Removed ${socket.id} from lobby ${connection.lobbyId}`);

          if (lobby.players.length === 0) {
            // Delete empty lobby
            lobbies.delete(connection.lobbyId);
            console.log(`Deleted empty lobby ${connection.lobbyId}`);
          } else {
            // Notify remaining players
            io.to(connection.lobbyId).emit('lobbyUpdated', lobby);
            console.log(`Notified lobby ${connection.lobbyId} about update`);
          }
        }
      }

      // Cleanup connection tracking
      playerConnections.delete(socket.id);
    });

    socket.on('startGame', (lobbyId) => {
        console.log(`Received startGame for lobby: ${lobbyId}`);
        const lobby = lobbies.get(lobbyId);
        
        if (!lobby) {
          console.log(`Lobby ${lobbyId} not found`);
          return;
        }
      
        console.log(`Current lobby status: ${lobby.status}`);
        console.log(`Requester: ${socket.id}, Creator: ${lobby.players[0]?.id}`);
      
        if (lobby.status === 'waiting') {
          const isCreator = lobby.players[0]?.id === socket.id;
          
          if (isCreator) {
            lobby.status = 'playing';
            console.log(`Starting game for lobby ${lobbyId}`);
            
            const question = getRandomQuestion();
            console.log(`Sending question: ${question.question}`);
            
            io.to(lobbyId).emit('gameStarted', {
              lobby: { ...lobby, status: 'playing' },
              question
            });
          } else {
            console.log(`Unauthorized start attempt by ${socket.id}`);
            socket.emit('error', 'Only lobby creator can start the game');
          }
        }
    });

    function getRandomQuestion() {
        return {
            question: "What is the capital of France?",
            answers: ["Paris", "London", "Berlin", "Madrid"],
            correctIndex: 0
        };
    }
  });
};