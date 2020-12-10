const Alert = require('../models/alert');

exports.getAlerts = (req, res, next) => {
  //return a specific course as response
  const alertId = req.body.receiver_id;
  Alert.findByReciever_id(alertId)
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