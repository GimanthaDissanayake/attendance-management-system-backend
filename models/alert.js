const db = require('../util/database');

module.exports = class Alert {
    static findByReciever_id(reciever_id) {
        // return alert by the lecturer id
        return db.execute('SELECT lecturer_name , alert.alert_id , send.lecturer_id , message, date_time FROM alert, lecturer , send WHERE alert.alert_id = send.alert_id AND lecturer.lecturer_id = send.lecturer_id AND receiver_id=? ORDER BY date_time DESC ', [reciever_id] );
    }

    static insertAlert(message,receiver,userId){
        let date = new Date();
        date = date.toISOString().slice(0, 19).replace('T', ' ');
        const is_read = 0;
        return db.execute('INSERT INTO alert(date_time,message,receiver_type,receiver_id,is_read) VALUES (? ,?, ?, ?,?)',[date,message,receiver,userId,is_read]);
    }

    static getBadgeNumber(userId) {
        const is_read = 0;
        return db.execute('SELECT alert_id FROM alert where is_read = ? and receiver_id = ?',[is_read,userId] );
    }

    
};
