// import 3rd party package
const express = require('express');

//import course controller
const courseController = require('../controllers/course');
const studentController = require('../controllers/student');
const lecturerController = require('../controllers/lecturer');
//export middleware for authentication
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /api/course/registration_no/ with registration_no in the req.body => POST
router.post('/registration_no/' , studentController.getAllStudentsCourses);
//request with authentication middleware
//router.get('/registration_no/', isAuth , studentController.getAllStudentsCourses);

// /api/course/lecturer_id/ with lecturer_id in the req.body => POST
router.post('/lecturer_id/' , lecturerController.getAllLecturersCourses);

// /api/course/:course_code => GET
router.get('/:course_code', courseController.getCourse);

// /api/course => GET
router.get('/', courseController.getCourses);


module.exports = router;