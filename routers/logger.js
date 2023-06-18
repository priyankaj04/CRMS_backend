const express = require('express');
const app = express.Router();
const pool = require('../database');
const moment = require('moment');

//"POST" method for recruiter registration
app.route('/').post(async (req, res) => {
    try {
        const { member, type } = req.body;
        const datetime = moment();
        const newLogger = await pool.query("INSERT INTO recruiter (member, type, datetime ) VALUES ($1, $2, $3) RETURNING *", [member, type, datetime]);
        console.log("user is created");
        res.json({ status: 1, data: newLogger.rows });
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})


module.exports = app;