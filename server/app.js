const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const pathModule = require('path');
const moment = require('moment');
const users = [];
const PORT = process.env.PORT || 3000;

const app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(pathModule.join(__dirname, '..', 'front-end')));

io.on('connection', (socket) => {
    console.log('some one connected');
    socket.emit('newMessage', {
        from: 'admin',
        text: 'welcome to our chat room',
        at: moment().format('H:mm')
    });
    socket.broadcast.emit('newMessage', {
        from: 'admin',
        text: 'new user joined',
        at: moment().format('H:mm')
    });
    socket.on('join', (params, cb) => {
        if (params.name.trim().length > 0) {
            socket.name = params.name;
            users.push(params.name);
            socket.broadcast.emit('newUser', params.name);
            socket.emit('allUsers', users);
            cb();
        } else {
            cb('ops!');
        }
    });
    socket.on('createMessage', (message, cb) => {
        io.emit('newMessage', {
            from: socket.name,
            text: message.text,
            at: moment().format('H:mm')
        });
        cb();
    });
    socket.on('createLocation', (location, cb) => {
        io.emit('newLocation', {
            from: socket.name,
            latitude: location.latitude,
            longitude: location.longitude,
            at: moment().format('H:mm')
        });
        cb();
    });
    socket.on('disconnect', () => {
        console.log('some one disconnected');
        users.splice(users.indexOf(socket.name), 1);
        io.emit('exitUser', socket.name)
    })
});

server.listen(PORT, () => {
    console.log('we\'re ready')
});
