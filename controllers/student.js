//import models
const Student = require('../models/student');
const Course = require('../models/course');

exports.getStudents = (req, res, next) => {
    //return all the students as response
    Student.fetchAll().then(students => {
        res.status(200).json({students: students[0]});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });    
};

exports.getStudentsByMentorId = (req, res, next) => {
    //return all the students with the passed mentor id
    const mentorId = req.params.mentor_id;
    console.log(req.params);
    Student.findByMentorId(mentorId).then(students => {
        res.status(200).json({students: students[0]});
    })
    .catch(err =>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getAllStudentsCourses = (req, res, next) => {
    //return all the courses a student follows
    const registrationNo = req.body.registration_no;
    console.log(req.body);
    Course.findAllByStudentId(registrationNo)
    .then(courses => {
        if(!courses) {
            const error = new Error('Could not find courses.');
            error.statusCode = 400;
            throw error; 
        }
        res.status(200).json({courses: courses[0]});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getStudentsCourses = (req, res, next) => {
    //return all the courses the student follows in the current year
    const registrationNo = req.body.registration_no;
    Course.findByStudentId(registrationNo)
    .then(courses => {
        if(!courses) {
            const error = new Error('Could not find courses.');
            error.statusCode = 400;
            throw error; 
        }
        courses[0].forEach(course => {
            let c = new Course(course.course_code,course.course_title);
            course.level = c.getLevel();
            course.semester = c.getSemester();
        });
        res.status(200).json({courses: courses[0]});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getStudent = (req, res, next) => {
    //return a specific student as response
    const registrationNo = req.body.registration_no;
    Student.findByRegistrationNo(registrationNo)
    .then(student => {
        if(!student) {
            const error = new Error('Could not find student.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({student: student});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};