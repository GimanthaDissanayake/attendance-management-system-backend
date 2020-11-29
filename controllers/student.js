//import models
const Student = require('../models/student');
const Course = require('../models/course');
const CourseOffering = require('../models/courseOffering');

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
    let mappedCourses = null;
    Course.findByStudentId(registrationNo)
    .then(courses => {
        if(!courses) {
            const error = new Error('Could not find courses.');
            error.statusCode = 400;
            throw error; 
        }
        mappedCourses = courses[0].map((course) =>{
            let c = new Course(course.course_code,course.course_title);
            course.level = c.getLevel();
            course.semester = c.getSemester();
            return course;
        });
        const course_ids = mappedCourses.map(mc => {return mc.co_id;});
        
        CourseOffering.getAttendance(registrationNo,course_ids)
        .then((attendanceData) => {
            mappedCourses = mappedCourses.map((course) => {
                course.attendance_percentage = 0;
                attendanceData.forEach(c => {
                    if(c.co_id === course.co_id){
                        course.attendance_percentage = c.percentage;
                    }
                });
                return course;
            });
            return mappedCourses;
        })
        .then((mp) => {
            res.status(200).json({courses: mp});
        })
        .catch(err => {
            console.log('Catch '+err);
            next(err);
        });        
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getStudentsAttendance = (req, res, next) => {
    //return attendance data of a student
    const student_id = req.body.student_id;
    const co_id = req.body.co_id;

    CourseOffering.getAttendanceDetails(student_id,co_id)
    .then(attendance => {
        console.log(attendance[0]);
        if(!attendance) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({attendance: attendance[0]});
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