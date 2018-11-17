$(document).ready(function () {
    // make connection
    var socket = io.connect('http://localhost:4000');
    // query dom buttons
    var gameSendBtn = $('#game-send-btn')[0];
    // query form input fields
    var gameMessageField = $('#game-message-input')[0];
    // query form output fields
    var gameChatOutput = $('#game-chat-output')[0];
    var gameTypingDetector = $('#game-typing-detector')[0];
    // retrieve player object from local storage
    var urlString = window.location.href;
    var url = new URL(urlString);
    var playerKey = url.searchParams.get("name");
    var gameKey = url.searchParams.get("table");
    var player = JSON.parse(localStorage.getItem(playerKey));
    var game = JSON.parse(localStorage.getItem(gameKey));

    // game container listeners
    gameSendBtn.addEventListener('click', function () {
        socket.emit('game-chat', {
            message: gameMessageField.value,
            handle: player["username"]
        });
    })

    gameMessageField.addEventListener('keypress', function () {
        socket.emit('player-typing', player["username"]);
    })

    socket.on('game-chat', function (data) {
        gameTypingDetector.innerHTML = '';
        gameChatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    })

    socket.on('player-typing', function (data) {
        gameTypingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
    })
});