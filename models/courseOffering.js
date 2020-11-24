const db = require('../util/database');

module.exports = class CourseOffering {
    constructor(co_id, type, day_of_week, time_period, year, percentage, course_code) {
        this.co_id = co_id;
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
};