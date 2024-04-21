import socket, { type SocketMessage, SocketInternal } from '../socket';

type addNameMessage = {
  name: string;
} & SocketMessage;

function addName(message: addNameMessage) {
  Object.assign(message.ws.data, { name: message });
  message.wsClients.set(message.wsId, message.ws);
  console.log(`Nome added ${message.name}`);
}

socket.subscribe('addName', addName);
