const db = require('../util/database');

module.exports = class Lecturer {
    constructor(lecturer_id,lecturer_name,department_id) {
        this.lecturer_id = lecturer_id;
        this.lecturer_name = lecturer_name;
        this.department_id = department_id;
    }

    static findById(lecturerId) {
        //return a specific student from the database 
        return db.execute('SELECT * FROM lecturer WHERE lecturer_id = ?', [lecturerId]);
    }

    static getLecturerTimetable(lecturer_id) {
        const currentYear = new Date(). getFullYear();
        return db.execute('SELECT o.co_id,c.course_code,c.course_title,o.type,o.start_time,o.end_time,o.day_of_week FROM course c, course_offering o,teach r '+
        'WHERE o.course_code=c.course_code AND r.co_id=o.co_id AND r.lecturer_id=? AND o.year=?',[lecturer_id,currentYear]);
    }
};