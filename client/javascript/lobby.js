class Game {
    constructor() {
        this.cards = ['2-D', '2-C', '2-H', '3-S', '3-D', '3-C', '3-H', '3-S', '4-D', '4-C', '4-H', '4-S', '5-D', '5-C', '5-H', '5-S', '6-D', '6-C', '6-H', '6-S', '7-D', '7-C', '7-H', '7-S', '8-D', '8-C', '8-H', '8-S', '9-D', '9-C', '9-H', '9-S', '10-D', '10-C', '10-H', '10-S', 'jack-D', 'jack-C', 'jack-H', 'jack-S', 'queen-D', 'queen-C', 'queen-H', 'queen-S', 'king-D', 'king-C', 'king-H', 'king-S', 'ace-D', 'ace-C', 'ace-H', 'ace-S', 'joker-red', 'joker-red', 'joker-black', 'joker-black'];
        this.players = new Array(4);
    }
}

class Player {
    constructor(nickname) {
        this.nickname = nickname;
        this.cardsOnHand = new Array(5);
        this.points = 0;
    }
}

// instantiate player obejct
const player = new Player('temp');

// make connection
var socket = io.connect('http://localhost:4000');

// query dom
var welcomeContainer = document.getElementById('welcome-container');
var lobbyContainer = document.getElementById('lobby-container');
var gameContainer = document.getElementById('game-container');
var continueBtn = document.getElementById('continue-btn');
var sendBtn = document.getElementById('send-btn');
var gameSendBtn = document.getElementById('game-send-btn');
var createBtn = document.getElementById('create-btn');
var nicknameField = document.getElementById('nickname-input');
var messageField = document.getElementById('message-input');
var gameMessageField = document.getElementById('game-message-input');
var chatOutput = document.getElementById('chat-output');
var typingDetector = document.getElementById('typing-detector');
var gameChatOutput = document.getElementById('game-chat-output');
var gameTypingDetector = document.getElementById('game-typing-detector');

// add event listeners
continueBtn.addEventListener('click', function () {
    lobbyContainer.classList.remove('hidden');
    welcomeContainer.classList.add('hidden');
    player.nickname = nicknameField.value;
})

createBtn.addEventListener('click', function () {
    gameContainer.classList.remove('hidden');
    lobbyContainer.classList.add('hidden');
    // player.nickname = nicknameField.value;
})

sendBtn.addEventListener('click', function () {
    socket.emit('lobby-chat', {
        message: messageField.value,
        handle: player.nickname
    });
})

gameSendBtn.addEventListener('click', function () {
    socket.emit('game-chat', {
        message: gameMessageField.value,
        handle: player.nickname
    });
})

messageField.addEventListener('keypress', function () {
    socket.emit('typing', nicknameField.value);
})

gameMessageField.addEventListener('keypress', function () {
    socket.emit('player-typing', nicknameField.value);
})

// listen for events
socket.on('lobby-chat', function (data) {
    typingDetector.innerHTML = '';
    chatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
})

socket.on('game-chat', function (data) {
    gameTypingDetector.innerHTML = '';
    gameChatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
})

socket.on('typing', function (data) {
    typingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
})

socket.on('player-typing', function (data) {
    gameTypingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
})