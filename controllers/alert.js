const Alert = require('../models/alert');

exports.getAlertsOld = (req, res, next) => {
  //return a specific course as response
  const alertId = req.body.receiver_id;
  Alert.findByReciever_id_Old(alertId)
  .then(alert => {
      if(!alert) {
          const error = new Error('Could not find alerts.');
          error.statusCode = 400;
          throw error;
      }
      res.status(200).json({alert: alert[0]});
  })
  .catch(err => {
      if(!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  });
};

exports.getAlertsNew = (req, res, next) => {
    //return a specific course as response
    const alertId = req.body.receiver_id;
    Alert.findByReciever_id_New(alertId)
    .then(alert => {
        if(!alert) {
            const error = new Error('Could not find alerts.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({alert: alert[0]});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
  };


exports.sendAlert = (req, res, next) => {
    const message = req.body.message;
    const receiver = req.body.receiver;
    const userId = req.body.userId;
    const userName = req.body.username;
    Alert.insertAlert(message,receiver,userId,userName)
    .then(result => {
        if(result[0].affectedRows>0)
            res.status(200).json({message: 'success'});
        else
            res.status(200).json({message: 'not inserted'});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
  };



  

  exports.resetReadAlerts = (req, res, next) => {
    const userName = req.body.username;
    console.log(userName)
    Alert.resetAlert(userName)
    .then(result => {
        if(result[0].affectedRows>0)
            res.status(200).json({message: 'success'});
        else
            res.status(200).json({message: 'not inserted'});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
  };

  exports.getBadge = (req, res, next) => {
    const user_Id = req.body.userId;
    Alert.getBadgeNumber(user_Id)
    .then(alert => {
        if(!alert) {
            const error = new Error('Could not find alerts.');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({alert: alert[0]});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
  };