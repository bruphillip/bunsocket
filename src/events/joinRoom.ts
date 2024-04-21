import socket, { type SocketMessage, SocketInternal } from '../socket';
import { rooms } from './createRoom';

type JoinRoomMessage = {
  message: {
    roomId: string;
  };
} & SocketMessage;

function joinRoom(event: JoinRoomMessage) {
  const roomMembers = rooms.get(event.message.roomId) || [];
  roomMembers.push(event.wsId);
  rooms.set(event.message.roomId, roomMembers);
}

function leftRoom() {}

socket.subscribe('joinRoom', joinRoom);
socket.subscribe('leftRoom', leftRoom);
socket.subscribe(SocketInternal.CLOSE, leftRoom);
