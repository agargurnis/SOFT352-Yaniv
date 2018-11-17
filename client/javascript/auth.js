class Player {
    constructor(username) {
        this.username = username;
        this.cardsOnHand = new Array(5);
        this.points = 0;
    }
}
// instantiate a temporary player object
const player = new Player('temp');

$(document).ready(function () {
    // query the dom
    var username = $('#username-input')[0];
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