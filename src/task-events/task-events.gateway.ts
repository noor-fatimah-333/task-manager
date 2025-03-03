import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { io } from 'socket.io-client';

@WebSocketGateway({ cors: { origin: '*' } })
export class TaskEventsGateway {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>();
  handleConnection(client: any) {
    console.log('🟢 Client connected:', client.id);
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.clients.set(userId, client.id);
    }
  }

  handleDisconnect(client: any) {
    console.log('🔴 Client disconnected:', client.id);
    // Remove user from map
    for (const [userId, socketId] of this.clients.entries()) {
      if (socketId === client.id) {
        this.clients.delete(userId);
        break;
      }
    }
  }

  // Notify only the assigned user
  notifyUserTaskUpdated(userId: number, task: any) {
    const socketId = this.clients.get(String(userId));
    if (socketId) {
      this.server.to(socketId).emit('taskUpdated', task);
      console.log(`📢 Task update sent to User ${userId}`);
    } else {
      console.log(`⚠️ User ${userId} not connected.`);
    }
  }
}
