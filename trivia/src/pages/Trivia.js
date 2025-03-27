import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { FightScene } from '../models/FightScene';
import { Robot } from '../models/Robot';
import Lobby from '../components/Lobby';
import socket from '../utils/socket';

const Trivia = () => {
  const [gameState, setGameState] = useState('lobby');
  const [currentLobby, setCurrentLobby] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const handleStartGame = (lobby) => {
    // Emit evenimentul de start pentru joc
    const isHost = lobby.players[0].id === socket.id;
    if (isHost) {
      socket.emit('startGame', lobby.id);
    }
  };

  // Pornirea jocului – primirea evenimentului de gameStarted
  useEffect(() => {
    socket.on('gameStarted', (data) => {
      console.log('Jocul a început:', data);
      setGameState('playing');
      setCurrentLobby(data.lobby);
      setPlayers(data.lobby.players);
      setCurrentQuestion(data.question);
    });

    socket.on('nextQuestion', (data) => {
      console.log('Următoarea întrebare:', data);
      setCurrentLobby(data.lobby);
      setPlayers(data.lobby.players);
      setCurrentQuestion(data.question);
    });

    socket.on('lobbyUpdated', (lobby) => {
      setCurrentLobby(lobby);
      setPlayers(lobby.players);
    });

    socket.on('answerResult', (result) => {
      setIsAnswerCorrect(result.isCorrect);
      setFeedbackMessage(result.message);
      setShowAnswerFeedback(true);
      setTimeout(() => setShowAnswerFeedback(false), 1000);
    });

    socket.on('gameOver', (data) => {
      console.log('Game Over:', data);
      setGameState('finished');
      setCurrentLobby(data.lobby);
      setPlayers(data.lobby.players);
      socket.off('gameOver');
    });

    return () => {
      socket.off('gameStarted');
      socket.off('nextQuestion');
      socket.off('lobbyUpdated');
      socket.off('answerResult');
    };
  }, []);

  // Trimiterea răspunsului selectat către server
  const handleAnswerClick = (index) => {
    if (currentLobby && currentQuestion) {
      socket.emit('submitAnswer', { lobbyId: currentLobby.id, answerIndex: index });
    }
  };

  // Componentă pentru afișarea jucătorilor
  const PlayerGrid = ({ players }) => (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player, index) => (
          <div 
            key={player.id}
            className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg
                       border border-gray-200 flex items-center space-x-3
                       transition-transform hover:scale-105"
          >
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{index + 1}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">{player.username}</h3>
              <p className="text-sm text-gray-500">Score: {player.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const GameOverScreen = ({ players, winner }) => (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-lg flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Game Over! 🎉
        </h2>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-center mb-4 text-green-600">
            Winner: {winner.username} ({winner.score} points)
          </h3>
          <div className="space-y-4">
            {players.map((player, index) => (
              <div 
                key={player.id}
                className={`p-4 rounded-lg flex justify-between items-center
                  ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300' : 'bg-gray-100'}`}
              >
                <span className="font-medium">
                  #{index + 1}. {player.username}
                </span>
                <span className="font-semibold">{player.score} pts</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  );

  return (
    <div className='h-[calc(100vh-65px)] w-[100vw] relative'>
    {gameState === 'lobby' && <Lobby onStartGame={handleStartGame}/>}
    
    {gameState === 'playing' && (
      <div className="absolute inset-0 flex flex-col">
        <div className="bg-white/80 backdrop-blur-md shadow-sm p-4">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Trivia Battle - Lobby: {currentLobby?.id}
          </h1>
        </div>

        <div className="flex-1 flex flex-col items-center overflow-y-auto py-8">
          {showAnswerFeedback && (
            <div className={`fixed top-15 right-15 p-4 rounded-lg shadow-lg text-white 
              ${feedbackMessage == 'Răspuns corect!' ? 'bg-green-500' : 'bg-red-500'} 
              transition-opacity duration-300`}>
              {feedbackMessage}
            </div>
          )}

          {/* Question Section */}
          <div className="w-full max-w-2xl px-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Current Question
              </h2>
              {currentQuestion && (
                <>
                  <p className="text-gray-800 text-lg mb-6">
                    {currentQuestion.question}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.answers.map((answer, index) => (
                    <button
                      key={answer}
                      onClick={() => handleAnswerClick(index)}
                      className={`p-3 rounded-lg transition-all
                        ${selectedAnswerIndex === index 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 hover:bg-blue-200 text-gray-700'}
                        ${showAnswerFeedback && currentQuestion.correctAnswer === index 
                          ? '!bg-green-500 !text-white' 
                          : ''}`}
                    >
                      {answer}
                    </button>
                  ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Players Section */}
          <div className="w-full max-w-4xl px-4">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
              Players
            </h2>
            <PlayerGrid players={players} />
          </div>
        </div>
      </div>
    )}
      {gameState === 'finished' && currentLobby && (
      <GameOverScreen 
        players={players} 
        winner={players[0]} 
      />
    )}
    </div>
  );
};

export default Trivia;
