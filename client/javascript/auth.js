import axios from 'axios';

// Register 
export const registerUser = (userData) => {
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
export const loginUser = userData => {
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