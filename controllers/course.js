//import course model
const Course = require('../models/course');

exports.getCourses = (req, res, next) => {
    //return all the course as response
    Course.fetchAll().then( courses => {
        res.send(courses);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });
};

exports.getCourse = (req, res, next) => {
    //return a specific course as response
    const courseCode = req.params.course_code;
    Course.findByCourseCode(courseCode);
};