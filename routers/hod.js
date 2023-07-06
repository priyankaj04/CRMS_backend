const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { Hashpassword, Comparepassword } = require('../src/functions');
const moment = require('moment');

//"POST" method for hod registration
app.route('/registration').post(async (req, res) => {
    try {
        const { department, name, password } = req.body;
        console.log(req.body);
        const hod_id = uuidv4();
        const checkUser = await pool.query("SELECT * FROM hod WHERE department = $1", [department]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 0, message: "THIS DEPARTMENT RECORD ALREADY EXISTS" });
        } else {
            const encrypt = await Hashpassword(password);
            const newRegistration = await pool.query("INSERT INTO hod (hod_id, name, department, password ) VALUES ($1, $2, $3, $4) RETURNING *", [hod_id, name, department, encrypt]);
            const datetime = moment();
            const newLogger = await pool.query("INSERT INTO logger (member, type, datetime ) VALUES ($1, $2, $3) RETURNING *", [department, 'hod', datetime]);
            console.log("user is created");
            res.json({ status: 1, data: newRegistration.rows });
        }
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
});


//"POST" method for hod login
app.route('/login').post(async (req, res) => {
    try {
        let response = {};
        const { department, password } = req.body;
        const newLogin = await pool.query("SELECT * FROM hod WHERE department = $1", [department]);
        if (newLogin.rows.length == 0) {
            response.status = 0;
            response.data = { message: "DEPARTMENT RECORD DOSENT EXISTS" }
        } else {
            const compare = await Comparepassword(password, newLogin.rows[0].password)
            if (compare) {
                const datetime = moment();
                const newLogger = await pool.query("INSERT INTO logger (member, type, datetime ) VALUES ($1, $2, $3) RETURNING *", [department, 'hod', datetime]);
                response.status = 1;
                response.data = { message: "SUCCESSFUL LOGIN", hod_id: newLogin.rows[0].hod_id }
            } else {
                response.status = 0;
                response.data = { message: "PASSWORD DID NOT MATCH" }
            }
        }
        res.json(response);
    } catch (err) {
        console.log(err.message);
    }
});

module.exports = app;