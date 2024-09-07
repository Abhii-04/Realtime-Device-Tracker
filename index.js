const express = require('express');
const app = express();

// Setting up server
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', function (socket) {
    console.log('Connected');
    socket.on('sendLocation', function (data) {
        console.log(`Received location: Latitude: ${data.latitude}, Longitude: ${data.longitude}`);
        io.emit('receive-Location', {id:socket.id, data:data});
    });
});

// importing HTML file
app.use(express.static('public'));
app.get("/", function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
server.listen(3000, function () {
    console.log('Running on port :3000');
});
