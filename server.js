const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado:', socket.id);

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`Usuario ${socket.id} se unió a la ${room}`);
    });

    socket.on('change-color', (data) => {
        if (data.room === 'admin' || data.targetRoom) {
            io.to(data.targetRoom || 'Sala-1').emit('update-color', { color: data.color });
        } else {
            io.to(data.room).emit('update-color', data);
        }
    });

    socket.on('close-all-rooms', () => {
        console.log('¡Cerrando todas las salas y enviando mensaje final!');
        io.emit('show-closing-message');
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});