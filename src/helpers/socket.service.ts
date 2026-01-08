import WebSocket from "ws";
import jwt from "jsonwebtoken";

type SocketMap = Map<string, WebSocket>;

class SocketService {
  private users: SocketMap = new Map();

  addUser(userId: string, socket: WebSocket) {
    this.users.set(userId, socket);
  }

  removeUser(userId: string) {
    this.users.delete(userId);
  }

  getUserSocket(userId: string) {
    return this.users.get(userId);
  }
}

export const socketService = new SocketService();
