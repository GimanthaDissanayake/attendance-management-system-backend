const db = require('../util/database');

module.exports = class Student {
    constructor(registrationNo, studentName, degreeProgram, mentorId) {
        this.registrationNo = registrationNo;
        this.studentName = studentName;
        this.degreeProgram = degreeProgram;
        this.mentorId = mentorId;
    }

    getLevel() {
        //return the level of the student
        const currentYear = new Date().getFullYear();
        const level = currentYear-this.registrationNo.split('/')[1];
        return level;
    }

    static fetchAll() {
        //return all the students from the database
        return db.execute('SELECT * FROM student');
    }

    static findByCourseCode(registrationNo) {
        //return a specific student from the database 
        return db.execute('SELECT * FROM student WHERE student.registrationNo = ?', [registrationNo]);
    }

    static findByMentorId(mentorId) {
        //return a set of students from the database by their mentor id
        return db.execute('SELECT * FROM student WHERE student.mentorId = ?', [mentorId]);
    }
};