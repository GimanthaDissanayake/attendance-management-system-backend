//import models
const Course = require('../models/course');
const CourseOffering = require('../models/courseOffering');
const Student = require('../models/student');

exports.getCourses = (req, res, next) => {
    //return all the courses as response
    Course.fetchAll().then( courses => {
        res.status(200).json({courses: courses[0]});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });    
};

exports.getCourse = (req, res, next) => {
    //return a specific course as response
    const courseCode = req.params.course_code;
    Course.findByCourseCode(courseCode)
    .then(course => {
        if(!course) {
            const error = new Error('Could not find course.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({course: course[0]});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getTimetable = (req, res, next) => {
    const role = req.body.role;
    const id = req.body.id;

    let today = new Date().getDay();

    if(role==='student') {
        Student.getStudentTimetable(id)
        .then(result => {
            const courses = result[0];

            const mappedCourses = courses.map(course => {
                course.name = course.course_code  + ' (' + course.type + ')';

                let start_time = course.start_time.toString();
                let end_time = course.end_time.toString();
                start_time = (start_time.split('T')[1]).split(' ')[4];
                end_time = (end_time.split('T')[1]).split(' ')[4];

                let dayOfWeek = course.day_of_week;
                let myDate = new Date();

                if(today>dayOfWeek){
                    dayOfWeek=today-dayOfWeek;
                    myDate.setDate(myDate.getDate()-dayOfWeek);
                }
                else if(today<dayOfWeek){
                    dayOfWeek=dayOfWeek-today;  
                    myDate.setDate(myDate.getDate()+dayOfWeek);          
                }
                let dd = myDate.getDate();
                var mm = myDate.getMonth() + 1;
                var y = myDate.getFullYear();
                var someFormattedDate = y + '-'+ mm + '-'+ dd;

                course.start = someFormattedDate + ' ' + start_time;
                course.end = someFormattedDate + ' ' + end_time;

                return course;
            });
            return mappedCourses;
        })
        .then(courses => {
            if(!courses) {
                const error = new Error('Could not find course.');
                error.statusCode = 400;
                throw error;
            }
            res.status(200).json({courses: courses});
        }) 
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    } else {
        Lecturer.getLecturerTimetable(id)
        .then(timetable => {

        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    }
};


// .catch(err => {
    //     const error = new Error('error message');
    //     error.statusCode = 422;
    //     throw error;
    //     // console.log(err);
    //     // res.send(err);
    // });

    exports.getCourseTime = (req, res, next) => {
    //return the time details of a course
        const lecturerId = req.body.lecturer_id;
        Course.findByLecturerId(lecturerId)
        .then(courses => {
            if(!courses) {
                const error = new Error('Could not find courses.');
                error.statusCode = 400;
                throw error; 
            }
            courses[0].forEach(course  => {
            let c = new Course(course.course_code,course.course_title);
            course.level = c.getLevel();
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

        exports.getAttendanceCourse = (req, res, next) => {
            //return attendance data of a student
            //const type = req.body.type;
            const co_id = req.body.co_id;
        
            CourseOffering.getAttendanceByCoId(co_id)
            .then(attendance => {
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