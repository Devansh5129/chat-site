const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' } });
const users = new Map();

io.on('connection', (socket) => {
  socket.on('join', ({ name }) => {
    const safeName = String(name || '').trim().slice(0, 30);
    if (!safeName || users.size >= 2) return socket.emit('chatError', 'This chat is full.');
    users.set(socket.id, safeName);
    io.emit('message', { user: 'system', text: `${safeName} joined the chat.` });
  });

  socket.on('sendMessage', (text) => {
    const user = users.get(socket.id);
    const safeText = String(text || '').trim().slice(0, 500);
    if (user && safeText) io.emit('message', { user, text: safeText });
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    users.delete(socket.id);
    if (user) io.emit('message', { user: 'system', text: `${user} left the chat.` });
  });
});

server.listen(process.env.PORT || 5000, () => console.log('Chat server running on port 5000'));
