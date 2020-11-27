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
};