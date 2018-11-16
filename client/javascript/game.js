$(document).ready(function () {
    // make connection
    var socket = io.connect('http://localhost:4000');

    // query dom containers
    var lobbyContainer = $('#lobby-container')[0];
    var gameContainer = $('#game-container')[0];
    // query dom buttons
    var gameSendBtn = $('#game-send-btn')[0];
    // query form input fields
    var gameMessageField = $('#game-message-input')[0];
    // query form output fields
    var gameChatOutput = $('#game-chat-output')[0];
    var gameTypingDetector = $('#game-typing-detector')[0];

    // game container listeners
    gameSendBtn.addEventListener('click', function () {
        socket.emit('game-chat', {
            message: gameMessageField.value,
            handle: player.username
        });
    })

    gameMessageField.addEventListener('keypress', function () {
        socket.emit('player-typing', usernameField.value);
    })

    socket.on('game-chat', function (data) {
        gameTypingDetector.innerHTML = '';
        gameChatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    })

    socket.on('player-typing', function (data) {
        gameTypingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
    })
});