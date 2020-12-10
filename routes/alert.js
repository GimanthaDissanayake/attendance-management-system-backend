// import 3rd party package
const express = require('express');

//import course controller
const alertController = require('../controllers/alert');
//export middleware for authentication
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /api/course/registration_no/ with registration_no in the req.body => POST
router.post('/receiver_id/' , alertController.getAlerts);

module.exports = router;