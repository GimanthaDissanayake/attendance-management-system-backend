const db = require('../util/database');

module.exports = class Student {
    constructor(registrationNo, studentName, degreeProgram, mentorId) {
        this.registrationNo = registrationNo;
        this.studentName = studentName;
        this.degreeProgram = degreeProgram;
        this.mentorId = mentorId;
    }

    getCourses() {

    }

    getLevel() {
        //return the level of the student
    }

    static fetchAll() {
        //return all the students from the database
        return db.execute('SELECT * FROM student');
    }

    static findByRegistrationNo(registrationNo) {
        //return a specific student from the database 
        return db.execute('SELECT * FROM student WHERE student.registration_no = ?', [registrationNo]);
    }

    static findByMentorId(mentorId) {
        //return a set of students from the database by their mentor id
        return db.execute('SELECT * FROM student WHERE student.mentor_id = ?', [mentorId]);
    }
};