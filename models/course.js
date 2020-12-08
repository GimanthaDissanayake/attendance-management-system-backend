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
        // return db.execute('SELECT course_code, course_title FROM course WHERE course_code IN ('+
        // 'SELECT DISTINCT course_code FROM course_offering WHERE year=? AND co_id IN ('+
        // 'SELECT co_id FROM register WHERE registration_no=?))',[currentYear, registrationNo]);
        return db.execute('SELECT c.course_code, c.course_title, o.co_id, o.type FROM course c,course_offering o, register r'+
        ' WHERE c.course_code=o.course_code AND o.co_id=r.co_id AND o.type=r.type AND o.year=? AND r.registration_no=?',[currentYear, registrationNo]);
    }

    static async findByIdAndDuration(registrationNo, startDate, endDate) {
        return await db.execute('SELECT o.co_id, c.course_code,c.course_title, o.type ,COUNT(*) AS total,'+
            'SUM(CASE WHEN status=1 then 1 else 0 end) AS present'+
            ' FROM attendance a,course c,course_offering o WHERE a.co_id=o.co_id'+
            ' AND o.course_code=c.course_code AND a.student_id=? AND'+
            ' a.date_time BETWEEN ? AND ? GROUP BY o.co_id ',[registrationNo,startDate,endDate])
        .then(result => {
            //console.log(result[0]);
            const attendanceData = result[0];
            attendanceData.map(c => {
                if(c.total && c.present)
                    c.percentage = (100*c.present/c.total).toFixed(2);
            });
            return attendanceData;
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
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
        return db.execute('SELECT course.course_code,course.course_title,course_offering.type, teach.co_id, course_offering.start_time,course_offering.end_time,course_offering.day_of_week FROM course , course_offering , teach WHERE course.course_code = course_offering.course_code and teach.co_id = course_offering.co_id and lecturer_id = ?' , [lecturerId]);      
    }

    static findByLecturerId(lecturerId) {
        // return courses from database by the lecturer id
        const d = new Date();
       // const dayOfWeek = d.getDay(); 
       const dayOfWeek = "3"; 

        return db.execute('SELECT course_code, start_time , end_time ,type FROM course_offering WHERE day_of_week=? AND co_id IN('
        + 'SELECT co_id FROM teach WHERE lecturer_id=?)' , [dayOfWeek,lecturerId] );
 
    }
};