const db = require('../util/database');

module.exports = class User {
    constructor(username,password,role){
        this.username = username;
        this.password = password;
        this.role = role;
    }
};