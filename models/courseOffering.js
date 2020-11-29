const db = require('../util/database');

module.exports = class CourseOffering {
    constructor(co_id, type, day_of_week, time_period, year, percentage, course_code) {
        this.co_id = co_id;
        this.type = type;
        this.day_of_week = day_of_week;
        this. time_period = time_period;
        this.year = year;
        this.percentage = percentage;
        this.course_code = course_code;
    }

    static fetchAll() {
        //return all the course offerings from the database
        return db.execute('SELECT * FROM course_offering');
    }

    static findByCourseCode(co_id) {
        //return a specific course offering from the database 
        return db.execute('SELECT * FROM course WHERE course_offering.co_id = ?', [co_id]);
    }

    static findByStudentId(studentId) {
        // return db.execute('')
    }

    static async getAttendance(registration_no,co_ids) {
        // return attendance data
        var tokens = new Array(co_ids.length).fill('?').join(',');
        let data = [];
        data.push(registration_no);
        data = data.concat(co_ids);
        return await db.execute('SELECT co_id,count(*) AS total,'+ 
        'SUM(CASE WHEN status=1 then 1 else 0 end) AS present FROM attendance WHERE student_id=? AND co_id IN ('+tokens+') GROUP BY co_id',data)
        .then(result => {
            const attendanceData = result[0];
            attendanceData.map(c => {
                if(c.total && c.present)
                    c.percentage = (100*c.present/c.total).toFixed(2);
            });
            return attendanceData;
        }).catch(err => {
          console.log(err);
            next(err);
        });
    }
};