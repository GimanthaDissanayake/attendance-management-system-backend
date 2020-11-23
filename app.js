//import 3rd party libraries
require('dotenv').config();
const express = require('express');

const app = express();

// const id = 'CSC3242';
// console.log(id.split('')[3]);

app.use('/', (req, res, next) => {
    res.send('hello');
});

//start the server on port 3030
app.listen(3030);