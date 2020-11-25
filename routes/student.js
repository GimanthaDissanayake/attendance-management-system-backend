// import 3rd party package
const express = require('express');

//import student controller
const studentController = require('../controllers/student');

const router = express.Router();

// /student => GET
router.get('/', studentController.getStudents);

// /student/:mentor_id
router.get('/:mentor_id', studentController.getStudentsByMentorId);

// /student/:registration_no => GET
router.get('/:registration_no', studentController.getStudent);