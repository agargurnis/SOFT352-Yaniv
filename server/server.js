const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const auth = require('./api/auth');
const game = require('./api/game');
const bodyParser = require('body-parser');
const path = require('path');
const db = 'mongodb://admin:password007@ds053948.mlab.com:53948/soft352_yaniv';

// Connect to mongoDB
mongoose
    .connect(db, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('---> MongoDB Connected');
    })
    .catch(err => {
        console.log(err);
    });
// app setup
const app = express();
const server = app.listen(4000, function () {
    console.log("---> server listening to port 4000");
})
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// use routes
app.use('/api/auth', auth);
app.use('/api/game', game);
// use static files
app.use(express.static('../client'));
// main path
app.get('/', function (req, res) {
    res.sendFile(path.resolve('../client/index.html'));
});
// path to lobby html
app.get('/lobby', function (req, res) {
    res.sendFile(path.resolve('../client/lobby.html'));
});
// path to game html
app.get('/game', function (req, res) {
    res.sendFile(path.resolve('../client/game.html'));
});
// socket setup
const io = socket(server);

io.on('connection', function (socket) {
    // lobby chat 
    socket.on('lobby-chat', function (data) {
        io.sockets.emit('lobby-chat', data);
    })
    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    })
    // game chat
    socket.on('game-chat', function (data) {
        io.sockets.emit('game-chat', data);
    })
    socket.on('player-typing', function (data) {
        socket.broadcast.emit('player-typing', data);
    })
    // available game list 
    socket.on('game-created', function (data) {
        socket.broadcast.emit('game-created', data);
    })
    socket.on('game-joined', function (data) {
        socket.broadcast.emit('game-joined', data);
    })
    // game actions
    socket.on('shuffled-deck', function (data) {
        io.sockets.emit('shuffled-deck', data);
    })
    // game actions
    socket.on('card-swapped', function (data) {
        socket.broadcast.emit('card-swapped', data);
    })
})