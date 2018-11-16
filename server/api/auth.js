const express = require('express');
const router = express.Router();

// Load user module
const User = require('../models/User');

// GET api/auth/register
router.post('/register', (req, res) => {

    User.findOne({
        nickname: req.body.nickname
    }).then(user => {
        if (user) {
            return res.status(400).json({
                success: false
            });
        } else {
            const newUser = new User({
                nickname: req.body.nickname,
                password: req.body.password
            });

            newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }
    });
});

// GET api/auth/login
router.post('/login', (req, res) => {
    const nickname = req.body.nickname;
    const password = req.body.password;

    // Find user by nickname
    User.findOne({
        nickname: nickname
    }).then(user => {
        // Check for user
        if (!user) {
            return res.status(404).json({
                success: false
            });
        }

        if (user.password === password) {
            return res.status(200).json({
                success: true
            });
        } else {
            return res.status(404).json({
                success: false
            });
        }
    });
});

module.exports = router;