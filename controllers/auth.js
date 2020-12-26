//import 3rd party packages
//const { validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//import models
const User = require('../models/user');
const Student = require('../models/student');
const Lecturer = require('../models/lecturer');

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
        if(loadedUser.role === "student") {
            //find student's name and add it to response
            Student.findByRegistrationNo(loadedUser.username)
            .then(student => {                
                loadedUser.name = student[0][0].student_name;                
                res.status(200).json({
                    token: token, 
                    name: loadedUser.name,
                    username: loadedUser.username, 
                    role: loadedUser.role,
                    mahapola: student[0][0].mahapola
                });
            }).catch(err => {
                console.log(err);
                next(err);
            });
        } else if (loadedUser.role === "admin") {
            //add Administrator to the response
            loadedUser.name = "Administrator";
            res.status(200).json({
                token: token, 
                name: loadedUser.name,
                username: loadedUser.username, 
                role: loadedUser.role
            });
        } else {
            //find name from lecturer   
            Lecturer.findById(loadedUser.username)
            .then(lecturer => {
                loadedUser.name = lecturer[0][0].lecturer_name;

                res.status(200).json({
                    token: token, 
                    name: loadedUser.name,
                    username: loadedUser.username, 
                    role: loadedUser.role
                });
            })
            .catch(err => {
                console.log(err);
                next();
            });
        }
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};