import { io } from 'socket.io-client';

// Replace 'http://localhost:3000' with your backend WebSocket URL
const userId = 5; // Simulate logged-in user
const socket = io('http://localhost:3000', {
  query: { userId }, // Send userId during connection
});

// Handle successful connection
socket.on('connect', () => {
  console.log(`✅ Connected to WebSocket server as User ${userId}:`, socket.id);
});

// Listen for task updates
socket.on('taskUpdated', (task) => {
  console.log(`🔔 Task Updated for User ${userId}:`, task);
});

// Handle disconnection
socket.on('disconnect', () => {
  console.log(`❌ Disconnected from WebSocket server`);
});
