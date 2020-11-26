const db = require('../util/database');

module.exports = class User {
    constructor(username,password,role){
        this.username = username;
        this.password = password;
        this.role = role;
    }

    static findOne(req){
        const username = req.username;
        return db.execute('SELECT * FROM users WHERE username=? LIMIT 1', [username]);
    }
};