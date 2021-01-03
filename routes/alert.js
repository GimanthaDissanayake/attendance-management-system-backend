// import 3rd party package
const express = require('express');

//import course controller
const alertController = require('../controllers/alert');
//export middleware for authentication
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.post('/receiver_id_Old/' , isAuth, alertController.getAlertsOld);

router.post('/receiver_id_New/' , isAuth, alertController.getAlertsNew);

router.post('/reset_read/' , isAuth, alertController.resetReadAlerts);

router.post('/send_alert/' , isAuth, alertController.sendAlert);

router.post('/badge/' , alertController.getBadge);

module.exports = router;