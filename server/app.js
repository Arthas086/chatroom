const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const pathModule = require('path');

const PORT = process.env.PORT || 3000;

const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(pathModule.join(__dirname, '..', 'front-end')));

io.on('connection', (socket) => {
    console.log('some one connected');
    socket.emit('newMessage', {
        from: 'admin',
        text: 'welcome to our chat room'
    });
    socket.broadcast.emit('newMessage', {
        from: 'admin',
        text: 'new user joined'
    });
    socket.on('createMessage', (message, cb) => {
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            at: (new Date()).getTime()
        });
        cb();
    });
    socket.on('createLocation', (location,cb) => {
        io.emit('newLocation', {
            from: location.from,
            latitude: location.latitude,
            longitude: location.longitude,
            at: (new Date()).getTime()
        })
        cb();
    });
    socket.on('disconnect', () => {
        console.log('some one disconnected')
    })
});

server.listen(PORT, () => {
    console.log('we\'re ready')
});
