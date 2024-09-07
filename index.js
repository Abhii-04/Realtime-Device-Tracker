const express = require('express');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', function (socket) {
    console.log('Client connected:', socket.id);

    socket.on('sendLocation', function (data) {
        console.log(`Received location from ${socket.id}:`, data);
        
        
        io.emit('receive-Location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

app.use(express.static('public'));
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function () {
    console.log('Server running on port 3000');
});
