// Register 
registerUser = () => {
    var userData = {
        "nickname": $('#nickname-register-input')[0].value,
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
        "nickname": $('#nickname-input')[0].value,
        "password": $('#password-input')[0].value
    }
    axios
        .post('/api/auth/login', userData)
        .then(response => {
            console.log('successfully logged in');
            console.log(response);
        })
        .catch(error =>
            console.log(error)
        );
};