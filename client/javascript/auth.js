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
    // query the dom for the username
    var username = $('#username-input')[0];
    // welcome container listeners
    registerFormBtn.addEventListener('click', function () {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    })
    registerUserBtn.addEventListener('click', function () {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    })
    // successful login function
    function login() {
        player.username = username.value.toLowerCase();
        localStorage.setItem(player.username, JSON.stringify(player));
        window.location.href = "http://localhost:4000/lobby?name=" + player.username;
    }
    // Register 
    registerUser = () => {
        var userData = {
            "username": $('#username-register-input')[0].value,
            "password": $('#password-register-input')[0].value
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
            "username": $('#username-input')[0].value,
            "password": $('#password-input')[0].value
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