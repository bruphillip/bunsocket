import socket, { type SocketMessage } from '../socket';
import { rooms } from './createRoom';

type JoinRoomMessage = {
  message: {};
} & SocketMessage;

export function listRoom(event: JoinRoomMessage) {
  const currentRooms = [...rooms.keys()];

  event.ws.publish(
    'listRoom',
    JSON.stringify({
      eventName: 'listRoom',
      data: currentRooms,
    })
  );
}

socket.subscribe('listRoom', listRoom);
