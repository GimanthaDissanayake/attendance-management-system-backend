const db = require('../util/database');

module.exports = class Course {
    constructor(courseCode, courseTitle) {
        this.courseCode = courseCode;
        this.courseTitle = courseTitle;
        //this.departmentId = departmentId;
    }

    getLevel() {
        //return the level of the course
        return 'Level ' + this.courseCode.split('')[3];
    }

    getSemester() {
        //return the semester of the course
        return 'Semester ' + this.courseCode.split('')[4];
    }

    getAttendancePercentage() {
        //return the eligiblity of the course
    }

    // static getSemester(courseCode) {
    //     //return the semester of the course
    //     return courseCode.split('')[4];
    // }

    static fetchAll() {
        //return all the courses from the database
        return db.execute('SELECT * FROM course');
    }

    static findAllByStudentId(registrationNo) {
        return db.execute('SELECT DISTINCT course.course_code, course.course_title FROM course, course_offering,register WHERE register.registration_no=? AND register.co_id=course_offering.co_id AND register.type=course_offering.type AND course.course_code=course_offering.course_code',[registrationNo]);
    }

    static findByStudentId(registrationNo){
        const currentYear = new Date(). getFullYear();
        //return db.execute('SELECT DISTINCT course.course_code, course.course_title FROM course, course_offering,register WHERE register.registration_no=? AND course_offering.year=? AND register.co_id=course_offering.co_id AND register.type=course_offering.type AND course.course_code=course_offering.course_code',[registrationNo, currentYear]);
        return db.execute('SELECT course_code, course_title FROM course WHERE course_code IN ('+
        'SELECT DISTINCT course_code FROM course_offering WHERE year=? AND co_id IN ('+
        'SELECT co_id FROM register WHERE registration_no=?))',[currentYear, registrationNo]);
    }

    static findByCourseCode(courseCode) {
        //return a specific course from the database 
        return db.execute('SELECT * FROM course WHERE course.course_code = ?', [courseCode]);
    }

    static findByCourseDepartmentId(departmentId) {
        //return a set of courses from the database by the departmentId 
        return db.execute('SELECT * FROM course WHERE course.department_id = ?', [departmentId]);
    }

    static findCurrentLevel() {
        const currentYear = new Date().getFullYear();
        return db.execute('SELECT course_code FROM course WHERE year = ?', [currentYear]);
    }

    static findAllByLecturerId(lecturerId) {
        //return a set of courses from the database by the lecturerId
        return db.execute('SELECT course_code, course_title FROM course WHERE course_code IN ('
            +'SELECT course_code FROM course_offering WHERE co_id IN ('
            +'SELECT co_id FROM teach WHERE lecturer_id =?))',[lecturerId] );
    }
};