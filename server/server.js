const express = require('express');
const mongoose = require('mongoose');
const socket = require('socket.io');
const auth = require('./api/auth');
const bodyParser = require('body-parser');

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

// static files
app.use(express.static('../client'));

// socket setup
const io = socket(server);

io.on('connection', function (socket) {
    //console.log('made socket connection ' + socket.id);
    socket.on('lobby-chat', function (data) {
        io.sockets.emit('lobby-chat', data);
    })

    socket.on('game-chat', function (data) {
        io.sockets.emit('game-chat', data);
    })

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data);
    })

    socket.on('player-typing', function (data) {
        socket.broadcast.emit('player-typing', data);
    })
})