const db = require('../util/database');

module.exports = class Student {
    constructor(registrationNo, studentName, degreeProgram, mentorId) {
        this.registrationNo = registrationNo;
        this.studentName = studentName;
        this.degreeProgram = degreeProgram;
        this.mentorId = mentorId;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM student');
    }

    static fetchAllFromDepartment() {
        //return all the students from the database
        return db.execute('SELECT student.registration_no,student.student_name,degree_program.degree_name,student.mahapola,course_offering.course_code,MAX(course_offering.year), mentor_id,lecturer_name FROM student,register,course_offering,degree_program,lecturer WHERE student.registration_no=register.registration_no AND register.co_id=course_offering.co_id AND student.degree_id=degree_program.degree_id AND lecturer.lecturer_id = student.mentor_id GROUP BY student.registration_no');
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
        return db.execute('SELECT student.registration_no,student.student_name,degree_program.degree_name,student.mahapola,course_offering.course_code,MAX(course_offering.year) FROM student,register,course_offering,degree_program WHERE student.registration_no=register.registration_no AND register.co_id=course_offering.co_id AND student.degree_id=degree_program.degree_id AND student.mentor_id = ?', [mentorId]);
    }

    static getStudentTimetable(student_id) {
        const currentYear = new Date(). getFullYear();
        return db.execute('SELECT o.co_id,c.course_code,c.course_title,o.type,o.start_time,o.end_time,o.day_of_week FROM course c, course_offering o,register r '+
        'WHERE o.course_code=c.course_code AND r.co_id=o.co_id AND r.registration_no=? AND o.year=?',[student_id,currentYear]);
    }

    static findByCourseCode(courseCode){
        return db.execute('select DISTINCT register.registration_no , student_name from register, student , course_offering where course_offering.co_id = register.co_id and student.registration_no = register.registration_no and course_code =?',[courseCode]);
    }

    static findByCourseId(co_id) {
        return db.execute('select student.registration_no , mentor_id, lecturer_name , student_name  from register, student , lecturer where  student.registration_no = register.registration_no and lecturer.lecturer_id = student.mentor_id and register.co_id =?',[co_id]);
    }

    static insertAttendance(co_id,type, registration_nos,absent_ids) {
        //db.execute('INSERT INTO attendance(date_time,status) VALUES ()')
        const length = registration_nos.length + absent_ids.length;
        const present = registration_nos.length;
        const ids = registration_nos.concat(absent_ids);
        const args = [];
        let date = new Date();
        date = date.toISOString().slice(0, 19).replace('T', ' ');
        let query = 'INSERT INTO attendance(date_time,status,student_id,co_id,type) VALUES ';
        let n = 0;
        while(n<length){
            query += '(?,?,?,?,?),';
            args.push(date);
            if(n<present)
                args.push('1');
            else
                args.push('0');
            args.push(ids[n]);
            args.push(co_id);
            args.push(type);
            n++;
        }
        query = query.slice(0,-1);
        return db.execute(query,args);
    }

    static getAttendanceSheetDetails(date,coId){
        const y = date+"%";
        return db.execute('select student.registration_no , student_name , status from student , attendance where attendance.student_id = student.registration_no and attendance.co_id = ? and date_time like ?',[coId,y]);
    }

    static getRegisteredStudent(username){
        return db.execute('SELECT COUNT(DISTINCT course_code) AS count FROM course_offering , register WHERE course_offering.co_id = register.co_id AND year = YEAR(CURDATE()) AND registration_no = ?',[username]);
    }

    static getLecturerDays(username){
        return db.execute('SELECT COUNT(DISTINCT substring(date_time ,1,10)) AS count FROM attendance WHERE YEAR(date_time) = YEAR(CURDATE()) AND student_id = ?',[username]);
    }

    static getPresentDays(username){
        return db.execute('SELECT COUNT(attendance_id) AS count FROM attendance WHERE YEAR(date_time) = YEAR(CURDATE()) AND student_id = ? AND status = 1',[username]);
    }

    static getAbsentDays(username){
        return db.execute('SELECT COUNT(attendance_id) AS count FROM attendance WHERE YEAR(date_time) = YEAR(CURDATE()) AND student_id = ? AND status = 0',[username]);
    }

    static getTotalCourses(username){
        return db.execute('SELECT COUNT(DISTINCT teach.co_id) AS count FROM course_offering,teach where course_offering.co_id = teach.co_id AND year = YEAR(CURDATE()) AND lecturer_id =?',[username]);
    } 
    
    static getTotalConducted(username){
        return db.execute('SELECT COUNT(DISTINCT substring(date_time ,1,10)) AS count FROM teach,attendance,course_offering WHERE attendance.co_id = teach.co_id AND course_offering.co_id = attendance.co_id AND year = YEAR(CURDATE()) AND lecturer_id =?',[username]);
    } 

    static getTotalMentoring(username){
        return db.execute('SELECT COUNT(registration_no) AS count FROM student WHERE mentor_id =?',[username]);
    } 

    static getTotalDepCourses(username){
        return db.execute('SELECT COUNT(DISTINCT course.course_code) AS count FROM course, department, course_offering WHERE course.course_code = course_offering.course_code AND course.department_id = department.department_id AND year = YEAR(CURDATE()) AND department_head =?',[username]);
    }

    static getTotalDepDays(username){
        const currentYear = new Date(). getFullYear();
        return db.execute('SELECT COUNT(DISTINCT substring(date_time ,1,10)) AS count FROM course, department,attendance, course_offering WHERE course_offering.co_id = attendance.co_id AND course.course_code = course_offering.course_code AND course.department_id = department.department_id AND course_offering.year=? AND department_head =?',[currentYear,username]);
    }   
};