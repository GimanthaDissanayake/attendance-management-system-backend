//import 3rd party packages
const express = require('express');
const { body } = require('express-validator');

//import user model and auth controller
const adminController = require('../controllers/admin');

const router = express();

// /api/admin/mahapola/ with username and password in the body => POST
router.post('/mahapola/', adminController.setMahapolaDuration);

module.exports = router;