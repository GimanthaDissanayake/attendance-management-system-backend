const db = require('../util/database');

module.exports = class Admin {
    static setMahapolaDates(start_date,end_date) {
        return db.execute('INSERT INTO mahapola(start_date,end_date) VALUES (?,?)',[start_date,end_date]);
    }
};