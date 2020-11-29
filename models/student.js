const db = require('../util/database');

module.exports = class Student {
    constructor(registrationNo, studentName, degreeProgram, mentorId) {
        this.registrationNo = registrationNo;
        this.studentName = studentName;
        this.degreeProgram = degreeProgram;
        this.mentorId = mentorId;
    }

    static fetchAll() {
        //return all the students from the database
        return db.execute('SELECT * FROM student');
    }

    static findByRegistrationNo(registrationNo) {
        //return a specific student from the database 
        return db.execute('SELECT * FROM student INNER JOIN degree_program ON student.degree_id=degree_program.degree_id WHERE student.registration_no = ?', [registrationNo]);
    }

    static findByMentorId(mentorId) {
        //return a set of students from the database by their mentor id
        return db.execute('SELECT * FROM student WHERE mentor_id = ?', [mentorId]);
    }
};