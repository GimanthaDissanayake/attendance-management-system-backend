// import 3rd party package
const express = require('express');

//import student controller
const studentController = require('../controllers/student');

const router = express.Router();

// /api/student/mentor/:mentor_id
router.get('/mentor/:mentor_id', studentController.getStudentsByMentorId);

// /api/student/courses
router.post('/courses/', studentController.getStudentsCourses);

// /api/student/all_courses
router.get('/all_courses/', studentController.getAllStudentsCourses);

// /api/student/registration_no/ => GET
router.post('/registration_no/', studentController.getStudent);

// /api/student => GET
router.get('/', studentController.getStudents);

module.exports = router;