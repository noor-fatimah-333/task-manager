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

  afterInit(server: Server) {
    console.log('✅ WebSocket Server Initialized');
  }

  handleConnection(client: any) {
    console.log('🟢 Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('🔴 Client disconnected:', client.id);
  }

  // Notify all clients about a task update
  notifyTaskUpdated(task: any) {
    console.log('send notification to all clients');
    this.server.emit('taskUpdated', task);
  }

  @SubscribeMessage('triggerTaskUpdate')
  handleTaskUpdate(@MessageBody() task: any) {
    console.log('notify users about task update');
    this.notifyTaskUpdated(task);
    return { message: 'Task update event triggered', task };
  }
}
