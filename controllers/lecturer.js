const Course = require('../models/course');

exports.getAllLecturersCourses = (req, res, next) => {
  //return all the courses a student follows

  const lecturerID = req.body.lecturer_id;
  console.log(lecturerID);
  Course.findAllByLecturerId(lecturerID)
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
      //console.log(courses[0]);
      res.status(200).json({courses: courses[0]});
  })
  .catch(err => {
      if(!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  });
};












// //import models
// const Lecturer = require('../models/lecturer');

// exports.getLecturer = (req, res, next) => {
//     //return all the courses as response
//     Lecturer.fetchAll().then( lecturers => {
//         res.status(200).json({lecturers: lecturers[0]});
//     })
//     .catch(err => {
//         if(!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     });    
// };

// exports.getLecturers = (req, res, next) => {
//     //return a specific course as response
//     const lecturerId = req.params.lecturer_id;
//     Lecturer.findByLecuterId(lecturerId)
//     .then(lecturer => {
//         if(!lecturer) {
//             const error = new Error('Could not find course.');
//             error.statusCode = 400;
//             throw error;
//         }
//         res.status(200).json({lecturer: lecturer[0]});
//     })
//     .catch(err => {
//         if(!err.statusCode) {
//             err.statusCode = 500;
//         }
//         next(err);
//     });
// };

