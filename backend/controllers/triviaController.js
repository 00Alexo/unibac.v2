const { v4: uuidv4 } = require('uuid');

const lobbies = new Map();
const playerConnections = new Map();

// Lista de întrebări
const questions = [
  {
    question: "What is the capital of France?",
    answers: ["Paris", "London", "Berlin", "Madrid"],
    correctIndex: 0
  },
  {
    question: "What is 2 + 2?",
    answers: ["3", "4", "5", "6"],
    correctIndex: 1
  },
  {
    question: "What color do you get when you mix red and white?",
    answers: ["Pink", "Purple", "Orange", "Brown"],
    correctIndex: 0
  },
  // adaugă alte întrebări după preferințe
];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New WebSocket connection:', socket.id);

    // Stochează informațiile despre conexiune
    playerConnections.set(socket.id, { 
      lobbyId: null,
      username: null,
      hasAnswered: false  // pentru a preveni mai multe răspunsuri la aceeași întrebare
    });

    // Crearea unui lobby
    socket.on('createLobby', (username) => {
      const lobbyId = uuidv4().slice(0, 6).toUpperCase();
      const lobby = {
        id: lobbyId,
        players: [{ id: socket.id, username, score: 0 }],
        status: 'waiting',
        // Vom adăuga proprietățile questions și questionIndex la startul jocului
        questions: [],
        questionIndex: 0,
        currentQuestion: null,
        responses: {}  // stocăm răspunsurile primite: id jucător -> răspunsul trimis
      };

      playerConnections.set(socket.id, { 
        lobbyId,
        username,
        hasAnswered: false
      });

      lobbies.set(lobbyId, lobby);
      socket.join(lobbyId);
      socket.emit('lobbyCreated', lobby);
      console.log(`Lobby creat: ${lobbyId} de ${username}`);
    });

    // Alăturarea unui lobby existent
    socket.on('joinLobby', ({ lobbyId, username }) => {
      const lobby = lobbies.get(lobbyId);
      if (lobby && lobby.status === 'waiting') {
        lobby.players.push({ id: socket.id, username, score: 0 });
        playerConnections.set(socket.id, { 
          lobbyId,
          username,
          hasAnswered: false
        });
        socket.join(lobbyId);
        io.to(lobbyId).emit('lobbyUpdated', lobby);
        console.log(`${username} a intrat în lobby ${lobbyId}`);
      } else {
        socket.emit('joinError', 'Lobby ID invalid sau jocul a început deja');
        console.log(`Încercare eșuată de join pentru ${lobbyId} de către ${username}`);
      }
    });

    // Pornirea jocului de către creatorul lobby-ului
    socket.on('startGame', (lobbyId) => {
      console.log(`startGame primit pentru lobby: ${lobbyId}`);
      const lobby = lobbies.get(lobbyId);
      if (!lobby) {
        console.log(`Lobby ${lobbyId} nu a fost găsit`);
        return;
      }
      if (lobby.status === 'waiting') {
        const isCreator = lobby.players[0]?.id === socket.id;
        if (isCreator) {
          lobby.status = 'playing';
          // Resetează scorurile și starea de răspuns pentru fiecare jucător
          lobby.players = lobby.players.map(player => ({ ...player, score: 0 }));
          lobby.players.forEach(player => {
            const connection = playerConnections.get(player.id);
            if (connection) connection.hasAnswered = false;
          });
          // Generează o ordine aleatorie pentru întrebări și initializează indexul
          lobby.questions = questions.slice().sort(() => Math.random() - 0.5);
          lobby.questionIndex = 0;
          // Setează prima întrebare
          lobby.currentQuestion = lobby.questions[lobby.questionIndex];
          lobby.responses = {};
          io.to(lobbyId).emit('gameStarted', { lobby, question: lobby.currentQuestion });
          console.log(`Jocul a început în lobby ${lobbyId} cu prima întrebare: ${lobby.currentQuestion.question}`);
        } else {
          socket.emit('error', 'Doar creatorul lobby-ului poate porni jocul');
        }
      }
    });

    // Evenimentul de trimitere a răspunsului
    socket.on('submitAnswer', ({ lobbyId, answerIndex }) => {
      const lobby = lobbies.get(lobbyId);
      if (!lobby || lobby.status !== 'playing') {
        return socket.emit('error', 'Jocul nu a început sau lobby invalid.');
      }
      if (!lobby.currentQuestion) {
        return socket.emit('error', 'Nu există nicio întrebare activă.');
      }

      // Previne trimiterea multiplă
      const connection = playerConnections.get(socket.id);
      if (connection?.hasAnswered) {
        return socket.emit('error', 'Ai răspuns deja la această întrebare.');
      }
      connection.hasAnswered = true;
      lobby.responses[socket.id] = answerIndex;

      // Verifică răspunsul și actualizează scorul
      const isCorrect = answerIndex === lobby.currentQuestion.correctIndex;
      if (isCorrect) {
        lobby.players = lobby.players.map(player => {
          if (player.id === socket.id) {
            return { ...player, score: player.score + 1 };
          }
          return player;
        });
      }

      socket.emit('answerResult', { correct: isCorrect, message: isCorrect ? 'Răspuns corect!' : 'Răspuns greșit!' });
      io.to(lobbyId).emit('lobbyUpdated', lobby);
      console.log(`Răspuns de la ${socket.id} pentru lobby ${lobbyId}: ${isCorrect ? 'Corect' : 'Greșit'}`);

      // Dacă toți jucătorii au răspuns sau după un delay, trecem la următoarea întrebare
      if (Object.keys(lobby.responses).length === lobby.players.length) {
        setTimeout(() => {
          // Resetăm flag-ul "hasAnswered" pentru toți jucătorii
          lobby.players.forEach(player => {
            const conn = playerConnections.get(player.id);
            if (conn) conn.hasAnswered = false;
          });
          // Trecem la următoarea întrebare
          lobby.questionIndex++;
          if (lobby.questionIndex < lobby.questions.length) {
            lobby.currentQuestion = lobby.questions[lobby.questionIndex];
            lobby.responses = {};
            io.to(lobbyId).emit('nextQuestion', { question: lobby.currentQuestion, lobby });
            console.log(`Următoarea întrebare în lobby ${lobbyId}: ${lobby.currentQuestion.question}`);
          } else {
            // Dacă s-au terminat întrebările, jocul se încheie
            lobby.status = 'finished';
            // Trimite clasamentul final
            const finalScores = lobby.players.sort((a, b) => b.score - a.score);
            io.to(lobbyId).emit('gameOver', { 
              lobby: { ...lobby, players: finalScores },
              winner: finalScores[0] 
            });
            console.log(`Jocul s-a terminat în lobby ${lobbyId}`);
          }
        }, 3000); // delay de 3 secunde pentru feedback
      }
    });

    // La deconectare
    socket.on('disconnect', () => {
      console.log(`Client deconectat: ${socket.id}`);
      const connection = playerConnections.get(socket.id);
      if (connection?.lobbyId) {
        const lobby = lobbies.get(connection.lobbyId);
        if (lobby) {
          lobby.players = lobby.players.filter(player => player.id !== socket.id);
          console.log(`Eliminat ${socket.id} din lobby ${connection.lobbyId}`);
          if (lobby.players.length === 0) {
            lobbies.delete(connection.lobbyId);
            console.log(`Lobby-ul ${connection.lobbyId} a fost șters deoarece este gol`);
          } else {
            io.to(connection.lobbyId).emit('lobbyUpdated', lobby);
            console.log(`Lobby ${connection.lobbyId} a fost actualizat`);
          }
        }
      }
      playerConnections.delete(socket.id);
    });
  });
};
