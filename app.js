//import 3rd party libraries
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

//import the routes 
const studentRoutes = require('./routes/student');
const courseRoutes = require('./routes/course');
const authRoutes = require('./routes/auth');

const app = express();

// const pw = '1234';
// bcrypt.hash(pw,12).then(hashedpw => {
//     console.log(hashedpw);
// })
// .catch(err => {
//     console.log(err);
// });

//use body parser to parse json data
app.use(bodyParser.json());

//set headers to handle CORS(Cross-Origin Resource Sharing) errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//middleware to handle routes
app.use('/api/student', studentRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/auth', authRoutes);

//middleware to handle errors
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
});

//start the server on port 3030
app.listen(3030);