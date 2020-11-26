const jwt = require('jsonwebtoken');

/*
add following headers to frontend when sending request to backend
headers: {
    Authorization: 'Bearer ' + this.props.token
}
*/

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        const error = new Error('Authorization header not set!');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }
    req.username = decodedToken.username;
    req.role = decodedToken.role;
    next();
};