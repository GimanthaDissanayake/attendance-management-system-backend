const db = require('../util/database');

module.exports = class Course {
    constructor(courseCode, courseTitle, degreeProgram, dayOfWeek, time, departmentId) {
        this.courseCode = courseCode;
        this.courseTitle = courseTitle;
        this.degreeProgram = degreeProgram;
        this.dayOfWeek = dayOfWeek;
        this.time = time;
        this.departmentId = departmentId;
    }

    getLevel() {
        //return the level of the course
        return this.courseCode.split('')[3];
    }

    getSemester() {
        //return the semester of the course
        return this.courseCode.split('')[4];
    }

    getAttendancePercentage() {
        //return the eligiblity of the course
    }

    static fetchAll() {
        //return all the courses from the database
        return db.execute('SELECT * FROM course');
    }

    static findByCourseCode(courseCode) {
        //return a specific course from the database 
        return db.execute('SELECT * FROM course WHERE course.id = ?', [courseCode]);
    }

    static findByCourseDepartmentId(departmentId) {
        //return a set of courses from the database by the departmentId 
        return db.execute('SELECT * FROM course WHERE course.departmentId = ?', [departmentId]);
    }
};