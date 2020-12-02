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

    static async getMahapola() {
        return await db.execute('SELECT * FROM mahapola ORDER BY id DESC LIMIT 1');
    }

    static findByRegistrationNo(registrationNo) {
        //return a specific student from the database 
        return db.execute('SELECT * FROM student INNER JOIN degree_program ON student.degree_id=degree_program.degree_id WHERE student.registration_no = ?', [registrationNo]);
    }

    static findByMentorId(mentorId) {
        //return a set of students from the database by their mentor id
        return db.execute('SELECT * FROM student WHERE mentor_id = ?', [mentorId]);
    }

    static getStudentTimetable(student_id) {
        const currentYear = new Date(). getFullYear();
        return db.execute('SELECT o.co_id,c.course_code,c.course_title,o.type,o.start_time,o.end_time,o.day_of_week FROM course c, course_offering o,register r '+
        'WHERE o.course_code=c.course_code AND r.co_id=o.co_id AND r.registration_no=? AND o.year=?',[student_id,currentYear]);
    }
};