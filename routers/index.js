const express = require('express');
const app = express.Router();

const { talent } = require('../routers/talent')
const { resume } = require('../routers/resume');

app.use('/talent', talent);
app.use('/resume', resume);