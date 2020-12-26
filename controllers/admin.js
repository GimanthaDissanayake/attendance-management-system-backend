const Admin = require('../models/admin');

exports.setMahapolaDuration = (req, res, next) => {
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    Admin.setMahapolaDates(start_date, end_date)
    .then(result => {
        if(!result) {
            const error = new Error('Error setting Mahapola Duration');
            error.statusCode = 400;
            throw error;
        }
        res.status(200).json({message: 'success'});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};