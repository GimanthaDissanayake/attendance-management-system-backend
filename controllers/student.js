//import models
const Student = require('../models/student');
const Course = require('../models/course');
const CourseOffering = require('../models/courseOffering');

exports.getStudents = (req, res, next) => {
    //return all the students as response
    Student.fetchAll().then(students => {
        const studentsList = students[0].map(s=>{
            if(s.mahapola===0)
                s.hasMahapola='No';
            else
                s.hasMahapola='Yes';
            s.level ='Level '+s.course_code.split('')[3];
            return s;
        });
        res.status(200).json({students: studentsList});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });    
};

exports.getStudentsByMentorId = async(req, res, next) => {
    //return all the students with the passed mentor id
    const mentorId = req.body.mentor_id;
    Student.findByMentorId(mentorId).then(students => {
        // const registration_nos = students[0].map(s=>{
        //     return s.registration_no;
        // });
        // console.log(registration_nos);
        // students[0].map(s=>{
        //     Course.findAllByStudentId(s.registration_no)
        //     .then(courses => {
        //         if(!courses) {
        //             const error = new Error('Could not find courses.');
        //             error.statusCode = 400;
        //             throw error; 
        //         }
        //         s.courses = courses[0];
        //     });
        // });
        // const studentsList = students[0];
        // studentsList.map(s=>{
        //     const courses = Course.findAllByStudentId(s.registration_no);
        //     console.log(courses);
        //     s.courses = courses[0];
        //     return s;
        // });
        const currentYear = new Date().getFullYear();
        
        const studentsList = students[0].map(s=>{
            if(s.mahapola===0)
                s.hasMahapola='No';
            else
                s.hasMahapola='Yes';
            s.level ='Level '+s.course_code.split('')[3];
            return s;
        });
        res.status(200).json({students: studentsList});
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
    //console.log(req.body);
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

exports.getMahapolaEligibility = (req, res, next) => {
    // return mahapola eligiblity status and time period
    const registration_no = req.body.registration_no;

    Student.getMahapola()
    .then(mahapola => {
        if(!mahapola) {
            const error = new Error('Could not find mahapola data.');
            error.statusCode = 400;
            throw error;
        }
        return mahapola[0][0];
    })
    .then(async mahapolaData => {
        const start_date = mahapolaData.start_date;
        const end_date = mahapolaData.end_date;
        await Course.findByIdAndDuration(registration_no,start_date,end_date)
        .then(result => {
            result = result.map(r => {
                r.start_date = start_date;
                r.end_date = end_date;
                return r;
            });

            res.status(200).json({mahapola: result});
        })
        .catch(er => {
            console.log(er);
            next(er);
        });
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

exports.getStudentsByCourseCode = (req, res, next) => {
    //return specific student by course code
    const CourseCode = req.body.course_code;
    Student.findByCourseCode(CourseCode)
    .then(students => {
        if(!students) {
            const error = new Error('Could not find courses.');
            error.statusCode = 400;
            throw error; 
        }
        res.status(200).json({students: students[0]});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getStudentsByCourseId = (req, res, next) => {
    //return specific student by course code
    const co_id = req.body.co_id;
    Student.findByCourseId(co_id)
    .then(students => {
        if(!students) {
            const error = new Error('Could not find courses.');
            error.statusCode = 400;
            throw error; 
        }
        //console.log(students);
        const registration_no_list = [];
        students[0].map(s => {
            registration_no_list.push(s.registration_no);
        });
        //console.log(students[0]);
        CourseOffering.getAttendanceByRegNoList(registration_no_list,co_id)
        .then(result => {     
            //console.log(result);       
            students[0].forEach(s=>{
                result.map(r=>{
                    if(r.student_id===s.registration_no){
                        s.percentage = r.percentage;
                    }
                });
            });
            res.status(200).json({students: students[0]});
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

exports.setAttendance = (req, res, next) => {
    const co_id = req.body.co_id;
    const type = req.body.type;
    const registration_nos = req.body.registration_nos;
    const absent_ids = req.body.absent_ids;
    Student.insertAttendance(co_id,type,registration_nos,absent_ids)
    .then(result => {
        if(result[0].affectedRows>0)
            res.status(200).json({message: 'success'});
        else
            res.status(200).json({message: 'not inserted'});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};     

exports.getStudentsAttendanceSheet = (req, res, next) => {
    //return attendance data of a student
    const date = req.body.date;
    const co_id = req.body.co_id;

    Student.getAttendanceSheetDetails(date,co_id)
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

exports.getRegisteredStudent = (req, res, next) => {
    const username = req.body.username;
    Student.getRegisteredStudent(username)
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getLecturerDays = (req, res, next) => {
    const username = req.body.username;
    Student.getLecturerDays(username)
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getPresentDays = (req, res, next) => {
    const username = req.body.username;
    Student.getPresentDays(username)
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getAbsentDays = (req, res, next) => {
    const username = req.body.username;
    Student.getAbsentDays(username)
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getTotalCourses = (req, res, next) => {
    const username = req.body.username;
    Student.getTotalCourses(username)
    
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getTotalConducted = (req, res, next) => {
    const username = req.body.username;
    Student.getTotalConducted(username)
    
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getTotalMentoring = (req, res, next) => {
    const username = req.body.username;
    Student.getTotalMentoring(username)
    
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getTotalDepCourses = (req, res, next) => {
    const username = req.body.username;
    Student.getTotalDepCourses(username)
    
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getTotalDepDays = (req, res, next) => {
    const username = req.body.username;
    Student.getTotalDepDays(username)
    
    .then(count => {
        if(!count) {
            const error = new Error('Could not find attendance data.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({count: count});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};




