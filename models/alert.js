const db = require('../util/database');

module.exports = class Alert {
    static findByReciever_id_Old(reciever_id) {
        // return alert by the lecturer id
        const is_read = 1;
        return db.execute('SELECT lecturer_name , alert.alert_id , lecturer.lecturer_id , message, date_time FROM alert, lecturer WHERE alert.lecturer_id = lecturer.lecturer_id AND  receiver_id=? AND is_read=? ORDER BY date_time DESC ', [reciever_id,is_read] );
    }

    static findByReciever_id_New(reciever_id) {
        // return alert by the lecturer id
        const is_read = 0;
        return db.execute('SELECT lecturer_name , alert.alert_id , lecturer.lecturer_id , message, date_time FROM alert, lecturer WHERE alert.lecturer_id = lecturer.lecturer_id AND  receiver_id=? AND is_read=? ORDER BY date_time DESC ', [reciever_id,is_read] );
    }

    static insertAlert(message,receiver,userId,userName){
        let date = new Date();
        date = date.toISOString().slice(0, 19).replace('T', ' ');
        const is_read = 0;
        return db.execute('INSERT INTO alert(date_time,message,receiver_type,receiver_id,is_read,lecturer_id) VALUES (? ,?, ?, ?,?,?)',[date,message,receiver,userId,is_read,userName]);
    }

    static resetAlert(userName,alertId){
        const is_read = 1;
        return db.execute('UPDATE alert SET is_read = ? WHERE receiver_id= ? AND alert_id = ?' ,[is_read,userName,alertId]);
    }

    static getBadgeNumber(userId) {
        const is_read = 0;
        return db.execute('SELECT alert_id FROM alert where is_read = ? and receiver_id = ?',[is_read,userId] );
    }

    
};
