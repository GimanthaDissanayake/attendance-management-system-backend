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

    static fetchAll(dep_id) {
        //return all the course offerings from the database
        return db.execute('SELECT * FROM course_offering,course WHERE course_offering.course_code=course.course_code AND course.department_id=? GROUP BY course_offering.co_id',[dep_id]);
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

    static async getAttendanceByRegNoList(registration_nos,co_id) {
        // return attendance data
        var tokens = new Array(registration_nos.length).fill('?').join(',');
        let data = [];
        data.push(co_id);
        data = data.concat(registration_nos);
        return await db.execute('SELECT student_id,co_id,count(*) AS total,'+ 
        'SUM(CASE WHEN status=1 then 1 else 0 end) AS present FROM attendance WHERE co_id=? AND student_id IN ('+tokens+') GROUP BY student_id',data)
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

    static getAttendanceDetails(registration_no,co_id) {
        //return attendance details of a student in a course offering
        return db.execute('SELECT * FROM attendance WHERE co_id=? AND student_id=?',[co_id,registration_no]);
    }
    
    static getAttendanceByCoId(coId){
        const query = 'SELECT DISTINCT CAST(date_time AS DATE) AS date_time,COUNT(*) AS total,'+
            'SUM(CASE WHEN status=1 then 1 else 0 end) AS present from attendance WHERE'+
            ' co_id=? group by date_time';
        return db.execute(query, [coId])
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

    static getAttendanceByCoIdList(coIdList){
        var tokens = new Array(coIdList.length).fill('?').join(',');
        // let data = [];
        // data = data.concat(co_ids);
        const query = 'SELECT DISTINCT CAST(date_time AS DATE) AS date_time,COUNT(*) AS total,'+
            'SUM(CASE WHEN status=1 then 1 else 0 end) AS present,co_id from attendance WHERE'+
            ' co_id IN ('+tokens+') group by date_time';
        return db.execute(query, coIdList)
        .then(result => {
            const attendanceData = result[0];
            attendanceData.map(c => {
                if(c.total && c.present)
                    c.percentage = (100*c.present/c.total).toFixed(2);
            });
            return attendanceData;
        });
    }
};