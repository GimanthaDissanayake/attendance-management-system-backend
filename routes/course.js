// import 3rd party package
const express = require('express');

//import course controller
const courseController = require('../controllers/course');
const studentController = require('../controllers/student');

const router = express.Router();

// /api/course/:registration_no => GET
router.get('/registration_no/', studentController.getAllStudentsCourses);

// /api/course/:course_code => GET
router.get('/:course_code', courseController.getCourse);

// /api/course => GET
router.get('/', courseController.getCourses);


module.exports = router;