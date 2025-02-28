import { io } from 'socket.io-client';

// Connect to the WebSocket server
const socket = io('http://localhost:3000'); // Replace with your actual backend URL

// Handle successful connection
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server:', socket.id);
});

// Listen for 'taskUpdated' event
socket.on('taskUpdated', (task) => {
  console.log('🆕 Task Updated:', task);
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log('❌ Disconnected from WebSocket server');
});
