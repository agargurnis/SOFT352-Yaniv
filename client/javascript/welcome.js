$(document).ready(function () {
    // make connection
    // var socket = io.connect('http://localhost:4000');

    // query dom containers
    var welcomeContainer = $('#welcome-container')[0];
    var lobbyContainer = $('#lobby-container')[0];
    var loginForm = $('#login-form')[0];
    var registerForm = $('#register-form')[0];
    // query dom buttons
    var registerFormBtn = $('#register-form-btn')[0];
    var registerUserBtn = $('#register-btn')[0];
    var loginBtn = $('#login-btn')[0];

    // welcome container listeners
    registerFormBtn.addEventListener('click', function () {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    })
    registerUserBtn.addEventListener('click', function () {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    })
    loginBtn.addEventListener('click', function () {
        welcomeContainer.classList.add('hidden');
        lobbyContainer.classList.remove('hidden');
    })
});