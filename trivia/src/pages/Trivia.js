import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Brad } from '../models/Brad';
import { Environment, OrbitControls } from '@react-three/drei';
import Lobby from '../components/Lobby';
import socket from '../utils/socket';  // Use shared instance

const Trivia = () => {
  const [gameState, setGameState] = useState('lobby');
  const [currentLobby, setCurrentLobby] = useState(null);
  const [players, setPlayers] = useState([]);

  const handleStartGame = (lobby) => {
    // Only emit if current user is the first player (host)
    const isHost = lobby.players[0].id === socket.id;
    if (isHost) {
      socket.emit('startGame', lobby.id);
    }
    // Local state will update via gameStarted event
  };

  useEffect(() => {
    const handleGameStarted = (data) => {
      console.log('Game started data:', data);
      setGameState('playing');
      setCurrentLobby(data.lobby);
      setPlayers(data.lobby.players);
    };

    socket.on('gameStarted', handleGameStarted);

    return () => {
      socket.off('gameStarted', handleGameStarted);
    };
  }, []);

  // Player grid component
  const PlayerGrid = ({ players }) => (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        {players.map((player, index) => (
          <div 
            key={player.id}
            className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg
                      border border-gray-200 flex items-center space-x-3
                      transition-transform hover:scale-105"
          >
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{index + 1}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{player.username}</h3>
              <p className="text-sm text-gray-500">Score: 0</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='h-[calc(100vh-72px)] w-[100vw] relative'>
      {gameState === 'lobby' && <Lobby onStartGame={handleStartGame} />}
      
      {gameState === 'playing' && (
        <div className="absolute inset-0 flex flex-col">
          {/* Game Header */}
          <div className="bg-white/80 backdrop-blur-md shadow-sm p-4">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              Trivia Battle - Lobby: {currentLobby?.id}
            </h1>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 grid grid-cols-[1fr_400px]">
            {/* 3D Canvas Area */}
            <div className="relative">
              <Canvas>
                <Environment preset="sunset" />
                <OrbitControls />
                <Brad position={[0, -1, 0]} scale={[0.5, 0.5, 0.5]} />
              </Canvas>
            </div>

            {/* Player Grid Sidebar */}
            <div className="bg-gray-50/95 backdrop-blur-lg p-6 border-l border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Players</h2>
              <PlayerGrid players={players} />
              
              {/* Question Area */}
              <div className="mt-8 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium mb-2">Current Question</h3>
                <p className="text-gray-600">What is the capital of France?</p>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {['Paris', 'London', 'Berlin', 'Madrid'].map((answer) => (
                    <button
                      key={answer}
                      className="p-2 bg-blue-100 rounded hover:bg-blue-200
                               transition-colors text-gray-700 text-sm"
                    >
                      {answer}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trivia;