class Player {
    constructor(username) {
        this.username = username;
        this.cardsOnHand = new Array();
        this.myTurn = false;
        this.pointsOnHand = 0;
    }
}
// instantiate a temporary player object
const player = new Player('temp');

$(document).ready(function () {
    // query dom containers
    var loginForm = $('#login-form')[0];
    var registerForm = $('#register-form')[0];
    // query dom buttons
    var registerFormBtn = $('#register-form-btn')[0];
    var registerUserBtn = $('#register-btn')[0];
    var loginBtn = $('#login-btn')[0];
    // query the dom for the username
    var usernameInput = $('#username-input')[0];
    var passwordInput = $('#password-input')[0];
    var usernameRegisterInput = $('#username-register-input')[0];
    var passwordRegisterInput = $('#password-register-input')[0];
    // welcome container listeners
    registerFormBtn.addEventListener('click', function () {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    })
    registerUserBtn.addEventListener('click', function () {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    })
    // click the login button on the press of the enter key in username input field
    usernameInput.addEventListener("keyup", function (e) {
        e.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            loginBtn.click();
        }
    });
    // click the login button on the press of the enter key in password input field
    passwordInput.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            loginBtn.click();
        }
    });
    // click the register button on the press of the enter key in username input field
    usernameRegisterInput.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            registerUserBtn.click();
        }
    });
    // click the register button on the press of the enter key in password input field
    passwordRegisterInput.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            registerUserBtn.click();
        }
    });
    // successful login function
    function login() {
        player.username = usernameInput.value.toLowerCase();
        localStorage.setItem(player.username, JSON.stringify(player));
        window.location.href = "http://localhost:4000/lobby?name=" + player.username;
    }
    // Register 
    registerUser = () => {
        var userData = {
            "username": usernameRegisterInput.value.toLowerCase(),
            "password": passwordRegisterInput.value
        }
        axios
            .post('/api/auth/register', userData)
            .then(response => {
                console.log('Successfully register');
                console.log(response);
            })
            .catch(error =>
                console.log(error)
            );
    };
    // Login
    loginUser = () => {
        var userData = {
            "username": usernameInput.value.toLowerCase(),
            "password": passwordInput.value
        }
        axios
            .post('/api/auth/login', userData)
            .then(response => {
                login();
            })
            .catch(error =>
                console.log(error)
            );
    };
});