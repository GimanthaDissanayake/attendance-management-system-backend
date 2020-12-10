const db = require('../util/database');

module.exports = class Alert {
    static findByReciever_id(reciever_id) {
        // return alert by the lecturer id
        return db.execute('SELECT lecturer_name , alert.alert_id , send.lecturer_id , message, date_time FROM alert, lecturer , send WHERE alert.alert_id = send.alert_id AND lecturer.lecturer_id = send.lecturer_id AND receiver_id=? ORDER BY date_time DESC ', [reciever_id] );
    }
};