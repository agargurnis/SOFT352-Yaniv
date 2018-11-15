// make connection
var socket = io.connect('http://localhost:4000');

// query dom
var welcomeContainer = document.getElementById('welcome-container');
var lobbyContainer = document.getElementById('lobby-container');
var continueBtn = document.getElementById('continue-btn');
var sendBtn = document.getElementById('send-btn');
// var createBtn = document.getElementById('create-btn');
var nicknameField = document.getElementById('nickname-input');
var messageField = document.getElementById('message-input');
var chatOutput = document.getElementById('chat-output');
var typingDetector = document.getElementById('typing-detector');

// add event listeners
continueBtn.addEventListener('click', function () {
    lobbyContainer.classList.remove('hidden');
    welcomeContainer.classList.add('hidden');
})

sendBtn.addEventListener('click', function () {
    socket.emit('chat', {
        message: messageField.value,
        handle: nicknameField.value
    });
})

messageField.addEventListener('keypress', function () {
    socket.emit('typing', nicknameField.value);
})

// listen for events
socket.on('chat', function (data) {
    typingDetector.innerHTML = '';
    chatOutput.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
})

socket.on('typing', function (data) {
    typingDetector.innerHTML = '<p><em>' + data + ' is typing...</em></p>';
})