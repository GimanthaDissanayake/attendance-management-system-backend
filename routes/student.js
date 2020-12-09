// import 3rd party package
const express = require('express');

//import student controller
const studentController = require('../controllers/student');

const router = express.Router();


// /api/student/course_codes => POST
router.post('/course_code/', studentController.getStudentsByCourseCode);

// /api/student/mentor/:mentor_id => GET
router.get('/mentor/:mentor_id', studentController.getStudentsByMentorId);

// /api/student/courses => POST
router.post('/courses/', studentController.getStudentsCourses);

// /api/student/attendance => POST
router.post('/attendance/', studentController.getStudentsAttendance);

// /api/student/markattendance => POST
router.post('/markattendance/', studentController.setAttendance);

// /api/student/all_courses => get
router.get('/all_courses/', studentController.getAllStudentsCourses);

// /api/student/registration_no/ => POST
router.post('/registration_no/', studentController.getStudent);

// /api/student/mahapola/ => POST
router.post('/mahapola/', studentController.getMahapolaEligibility);

// /api/student => GET
router.get('/', studentController.getStudents);

module.exports = router;