//import course model
const Student = require('../models/student');

exports.getStudents = (req, res, next) => {
    //return all the students as response
    Student.fetchAll().then(students => {
        res.status(200).json({students: students});
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
    Student.findByMentorId(mentorId).then(students => {
        res.status(200).json({students: students});
    })
    .catch(err =>{
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getStudent = (req, res, next) => {
    //return a specific student as response
    const registrationNo = req.params.registration_no;
    Course.findByRegistrationNo(registrationNo)
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