// import 3rd party package
const express = require('express');

//import course controller
const courseController = require('../controllers/admin');

const router = express.Router();

// /course => GET
router.get('/', courseController.getCourses);

// /course/:course_code => GET
router.get('/:course_code', adminController.getCourse);