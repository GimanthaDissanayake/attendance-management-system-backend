//import 3rd party libraries
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

//import the routes 
const studentRoutes = require('./routes/student');
const courseRoutes = require('./routes/course');

const app = express();

//use body parser to parse json data
app.use(bodyParser.json());

// const id = 'CSC3242';
// console.log(id.split('')[3]);

app.use('/student', studentRoutes);

app.use('/course', courseRoutes);

app.use('/', (req, res, next) => {
    res.send('hello');
});

//start the server on port 3030
app.listen(3030);