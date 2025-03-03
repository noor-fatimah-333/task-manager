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

  afterInit(server: Server) {
    console.log('✅ WebSocket Server Initialized');
  }

  handleConnection(client: any) {
    console.log('🟢 Client connected:', client.id);
    // Extract userId from handshake query
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.clients.set(userId, client.id);
      console.log(`📌 User ${userId} connected with socket ID: ${client.id}`);
    }
  }

  handleDisconnect(client: any) {
    console.log('🔴 Client disconnected:', client.id);
    // Remove user from map
    for (const [userId, socketId] of this.clients.entries()) {
      if (socketId === client.id) {
        this.clients.delete(userId);
        console.log(`🚫 Removed User ${userId} from WebSocket tracking.`);
        break;
      }
    }
  }

  // Notify only the assigned user
  notifyUserTaskUpdated(userId: number, task: any) {
    const socketId = this.clients.get(String(userId));
    console.log('socket id received : ' + socketId);
    if (socketId) {
      this.server.to(socketId).emit('taskUpdated', task);
      console.log(`📢 Task update sent to User ${userId}`);
    } else {
      console.log(`⚠️ User ${userId} not connected.`);
    }
  }
}
