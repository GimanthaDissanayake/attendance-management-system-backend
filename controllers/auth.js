//import 3rd party packages
const { validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//import models
const User = require('../models/user');

exports.login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;
    User.findOne({username: username})
    .then(user => {
        user=user[0][0];
        if(!user) {
            const error = new Error('A user with this username could not be found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        //console.log(user[0].BinaryRow.password);
        return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
        if(!isEqual) {
            const error = new Error('Incorrect Password!');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                username: loadedUser.username
            }, 
            process.env.JWT_SECRET, 
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
        res.status(200).json({token: token, username: loadedUser.username, role: loadedUser.role});
    })
    .catch(err => {

    });
};