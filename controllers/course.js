//import models
const Course = require('../models/course');

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


// .catch(err => {
    //     const error = new Error('error message');
    //     error.statusCode = 422;
    //     throw error;
    //     // console.log(err);
    //     // res.send(err);
    // });