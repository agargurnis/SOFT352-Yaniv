class Observable {
    // when instantiated create an empty observer array
    constructor() {
        this.observers = [];
    }
    // function to add new observers to the array
    subscribe(o) {
        this.observers.push(o);
    }
    // function to remove observer from array if needed
    unsubscribe(o) {
        this.observers = this.observers.filter(subscriber => subscriber !== o);
    }
    // function that notifies all the observers of an action that needs to be done
    notify(action) {
        if (action == 'enable') {
            this.observers.forEach(observer => (
                observer.classList.add('btn-primary'),
                observer.classList.remove('btn-secondary')
            ));
        } else if (action == 'disable') {
            this.observers.forEach(observer => (
                observer.classList.remove('btn-primary'),
                observer.classList.add('btn-secondary')
            ));
        }
    }
}
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
    // instantiate new Observer class
    const fieldObserver = new Observable();
    // query dom for validation field
    var validationField = $('.invalid')[0];
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
    // add buttons to observer array
    fieldObserver.subscribe(registerUserBtn);
    fieldObserver.subscribe(loginBtn);
    // welcome container listeners
    registerFormBtn.addEventListener('click', function () {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    })
    registerUserBtn.addEventListener('click', function () {
        if ($('#register-btn').hasClass('btn-primary')) {
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    })
    // click the login button on the press of the enter key in username input field
    usernameInput.addEventListener("keyup", function (e) {
        e.preventDefault();
        // Number 13 is the "Enter" key on the keyboard
        if (e.keyCode === 13) {
            loginBtn.click();
        }
        // check if both input fields have a value
        if (usernameInput.value !== '' && passwordInput.value !== '') {
            fieldObserver.notify('enable');
        } else {
            fieldObserver.notify('disable');
        }
    });
    // click the login button on the press of the enter key in password input field
    passwordInput.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            loginBtn.click();
        }
        // check if both input fields have a value
        if (usernameInput.value !== '' && passwordInput.value !== '') {
            fieldObserver.notify('enable');
        } else {
            fieldObserver.notify('disable');
        }
    });
    // click the register button on the press of the enter key in username input field
    usernameRegisterInput.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            registerUserBtn.click();
        }
        // check if both input fields have a value
        if (usernameRegisterInput.value !== '' && passwordRegisterInput.value !== '') {
            fieldObserver.notify('enable');
        } else {
            fieldObserver.notify('disable');
        }
    });
    // click the register button on the press of the enter key in password input field
    passwordRegisterInput.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            registerUserBtn.click();
        }
        // check if both input fields have a value
        if (usernameRegisterInput.value !== '' && passwordRegisterInput.value !== '') {
            fieldObserver.notify('enable');
        } else {
            fieldObserver.notify('disable');
        }
    });
    // successful login function
    function login() {
        player.username = usernameInput.value.toLowerCase();
        localStorage.setItem(player.username, JSON.stringify(player));
        window.location.href = "http://localhost:4000/lobby?name=" + player.username;
    }
    // unsuccessful login function
    function invalidCredentials() {
        validationField.classList.remove('hidden');
    }
    // Register 
    registerUser = () => {
        if ($('#register-btn').hasClass('btn-primary')) {
            var userData = {
                "username": usernameRegisterInput.value.toLowerCase(),
                "password": passwordRegisterInput.value
            }
            axios
                .post('/api/auth/register', userData)
                .then(response => {
                    if (response.status == 200) {
                        usernameRegisterInput.value = '';
                        passwordRegisterInput.value = '';
                        fieldObserver.notify('disable');
                    }
                })
                .catch(error =>
                    console.log(error)
                );
        }
    };
    // Login
    loginUser = () => {
        if ($('#login-btn').hasClass('btn-primary')) {
            var userData = {
                "username": usernameInput.value.toLowerCase(),
                "password": passwordInput.value
            }
            axios
                .post('/api/auth/login', userData)
                .then(response => {
                    if (response.status == 200) {
                        login();
                    }
                })
                .catch(error => {
                    invalidCredentials();
                    console.log(error);
                });
        }
    };
});