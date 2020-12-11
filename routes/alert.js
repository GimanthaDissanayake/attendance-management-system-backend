// import 3rd party package
const express = require('express');

//import course controller
const alertController = require('../controllers/alert');
//export middleware for authentication
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.post('/receiver_id/' , alertController.getAlerts);

router.post('/send_alert/' , alertController.sendAlert);

router.post('/badge/' , alertController.getBadge);

module.exports = router;