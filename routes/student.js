// import 3rd party package
const express = require('express');

//import student controller
const studentController = require('../controllers/student');

const router = express.Router();


// /api/student/course_codes => POST
router.post('/course_code/', studentController.getStudentsByCourseCode);

// /api/student/co_id => POST
router.post('/co_id/', studentController.getStudentsByCourseId);

// /api/student/mentor/ => POST
router.post('/mentor/', studentController.getStudentsByMentorId);

// /api/student/courses => POST
router.post('/courses/', studentController.getStudentsCourses);

// /api/student/attendance => POST
router.post('/attendance/', studentController.getStudentsAttendance);

// /api/student/markattendance => POST
router.post('/markattendance/', studentController.setAttendance);
// /api/student/attendance => POST
router.post('/attendance_sheet/', studentController.getStudentsAttendanceSheet);

// /api/student/all_courses => get
router.get('/all_courses/', studentController.getAllStudentsCourses);

// /api/student/registration_no/ => POST
router.post('/registration_no/', studentController.getStudent);

// /api/student/mahapola/ => POST
router.post('/mahapola/', studentController.getMahapolaEligibility);

// /api/student => GET
router.get('/', studentController.getStudents);

module.exports = router;