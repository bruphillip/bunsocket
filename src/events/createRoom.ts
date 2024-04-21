import { randomUUID } from 'crypto';
import socket, { type SocketMessage } from '../socket';
import { listRoom } from './listRooms';

type JoinRoomMessage = {
  message: string;
} & SocketMessage;

export const rooms = new Map<string, string[]>();

function createRoom(event: JoinRoomMessage) {
  console.log('creating room...');
  const roomId = randomUUID();

  rooms.set(roomId, [event.wsId]);
  console.log('room created', roomId);

  listRoom(event);
}

socket.subscribe('createRoom', createRoom);
