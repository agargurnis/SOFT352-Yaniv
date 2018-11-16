$(document).ready(function () {
    // query dom containers
    var loginForm = $('#login-form')[0];
    var registerForm = $('#register-form')[0];
    // query dom buttons
    var registerFormBtn = $('#register-form-btn')[0];
    var registerUserBtn = $('#register-btn')[0];

    // welcome container listeners
    registerFormBtn.addEventListener('click', function () {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    })
    registerUserBtn.addEventListener('click', function () {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    })
});