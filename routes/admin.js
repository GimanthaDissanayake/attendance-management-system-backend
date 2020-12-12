//import 3rd party packages
const express = require('express');
// const { body } = require('express-validator');

//import user model and auth controller
const adminController = require('../controllers/admin');
const lecturerController = require('../controllers/lecturer');

const router = express();

// /api/admin/mahapola/ with username and password in the body => POST
router.post('/mahapola/', adminController.setMahapolaDuration);

// /api/admin/department/ with hod_id in the body => POST
router.post('/department/', lecturerController.getDepartmentId);

module.exports = router;