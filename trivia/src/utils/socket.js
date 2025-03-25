import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_TRIVIA_API}`, {
  withCredentials: true,
  autoConnect: true,
  transports: ['websocket']
});

export default socket;