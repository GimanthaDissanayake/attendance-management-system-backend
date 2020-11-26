//import 3rd party packages
const express = require('express');
const { body } = require('express-validator');

//import user model and auth controller
const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express();

// /api/auth/login with username and password in the body => POST
router.post('/login', authController.login);

module.exports = router;