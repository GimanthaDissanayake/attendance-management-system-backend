//import 3rd party libraries
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

//import the routes 
const studentRoutes = require('./routes/student');
const courseRoutes = require('./routes/course');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const alertRoutes = require('./routes/alert');

const app = express();

// const pw = '1234';
// bcrypt.hash(pw,12).then(hashedpw => {
//     console.log(hashedpw);
// })
// .catch(err => {
//     console.log(err);
// });

//use helmet to add secure headers to node application
app.use(helmet());

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
app.use('/api/admin', adminRoutes);
app.use('/api/alert', alertRoutes);

//middleware to handle errors
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;   
    res.status(status).json({message: message, data: data});
});

//start the server on port 3030
app.listen(process.env.PORT || 3030);