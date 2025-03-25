import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGamepad, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import socket from '../utils/socket'; 

const Lobby = ({ onStartGame }) => {
  const [lobbyId, setLobbyId] = useState('');
  const [username, setUsername] = useState('');
  const [currentLobby, setCurrentLobby] = useState(null);

  const createLobby = () => {
    socket.emit('createLobby', username);
    socket.on('lobbyCreated', (lobby) => {
      setCurrentLobby(lobby);
    });
  };

  const joinLobby = () => {
    socket.emit('joinLobby', { lobbyId, username });
    socket.on('lobbyUpdated', (lobby) => {
      setCurrentLobby(lobby);
    });
  };

  useEffect(() => {
    const handleLobbyCreated = (lobby) => {
      setCurrentLobby(lobby);
    };

    const handleLobbyUpdated = (lobby) => {
      setCurrentLobby(prev => ({ ...prev, ...lobby }));
    };

    socket.on('lobbyCreated', handleLobbyCreated);
    socket.on('lobbyUpdated', handleLobbyUpdated);

    return () => {
      socket.off('lobbyCreated', handleLobbyCreated);
      socket.off('lobbyUpdated', handleLobbyUpdated);
    };
  }, []);

  useEffect(() => {
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });
  
    return () => {
      socket.off('connect_error');
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
        {!currentLobby ? (
          <div className="space-y-6">
            <div className="text-center">
              <FontAwesomeIcon icon={faGamepad} className="text-4xl text-blue-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-800">Trivia Lobby</h1>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter your username"
                />
              </div>

              <button
                onClick={createLobby}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Create New Lobby
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lobby ID
                </label>
                <input
                  type="text"
                  value={lobbyId}
                  onChange={(e) => setLobbyId(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter lobby code"
                />
              </div>

              <button
                onClick={joinLobby}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                Join Existing Lobby
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-center text-gray-800">
              Lobby: {currentLobby.id}
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Players in Lobby:</h3>
              <ul className="space-y-2">
                {currentLobby.players.map(player => (
                  <li 
                    key={player.id}
                    className="flex items-center bg-white p-3 rounded shadow-sm"
                  >
                    <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-2" />
                    {player.username}
                  </li>
                ))}
              </ul>
            </div>

            <button
                onClick={() => onStartGame(currentLobby)}
                disabled={currentLobby.players.length < 1 || currentLobby.players[0].id !== socket.id}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {currentLobby.players[0].id === socket.id ? 'Start Game' : 'Waiting for Host...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;