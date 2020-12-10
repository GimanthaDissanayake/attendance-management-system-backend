const Course = require('../models/course');
const CourseOffering = require('../models/courseOffering');

exports.getAllLecturersCourses = (req, res, next) => {
  //return all the courses a lecturer conducts
  const lecturerID = req.body.lecturer_id;
  Course.findAllByLecturerId(lecturerID)
  .then(courses => {
      if(!courses) {
          const error = new Error('Could not find courses.');
          error.statusCode = 400;
          throw error; 
      }
      const co_id_list = [];
      courses[0].forEach(course  => {
        let c = new Course(course.course_code,course.course_title);
        course.level = c.getLevel();
        course.semester = c.getSemester();
        co_id_list.push(course.co_id);
      });
      console.log(co_id_list);
      CourseOffering.getAttendanceByCoIdList(co_id_list)
      .then( result => {
        courses[0].map(c => {
          c.total = 0;
          c.totalPercentage = parseFloat(0.00);
          result.forEach(r => {
            if(c.co_id === r.co_id){
              c.total++;
              c.totalPercentage=c.totalPercentage + parseFloat(r.percentage);
            }
          });          
          if(c.total===0)
            c.attendance_percentage = 0;
          else
            c.attendance_percentage = c.totalPercentage/(c.total);
        });
        res.status(200).json({courses: courses[0]});
      })
      .catch(err => {
        if(!err.statusCode) {
          err.statusCode = 500;
        }
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

