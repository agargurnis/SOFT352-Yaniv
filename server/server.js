var express = require('express');
var socket = require('socket.io');

// app setup
var app = express();
var server = app.listen(4000, function () {
    console.log("server listening to port 4000");
})

// static files
app.use(express.static('../client'));

// socket setup
var io = socket(server);

io.on('connection', function (socket) {
    //console.log('made socket connection ' + socket.id);
    socket.on('lobby-chat', function (data) {
        io.sockets.emit('lobby-chat', data);
    })

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    })
})