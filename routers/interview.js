const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { Hashpassword, Comparepassword, generateRandomNumber } = require('../src/functions');
const moment = require('moment');

//"POST" method for interview details
app.route('/create').post(async (req, res) => {
    const { application_id, talent_id, slot_timings, slot_dates, link, description, slot_time, slots } = req.body;
    try {
        const interview_id = uuidv4();
        const newQuery = await pool.query("INSERT INTO interview (interview_id, application_id, talent_id , slot_timings, slot_dates, link, description, slot_time, slots) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [interview_id, application_id, talent_id, slot_timings, slot_dates, link, description, slot_time, slots]);
        if (newQuery.rows.length > 0) {
            console.log("interview is created");
            res.json({ status: 1, data: newQuery.rows });
        } else {
            res.json({ status: 0, message: "Insertion failed." }); 
        }

    } catch (err) {
        console.log(err.message);
    }
})

//'GET' method to get interview details by application id and talent_id
app.route('/getdetails').get(async (req, res) => {
    const { aid, tid } = req.query;
    try {
        const selectQuery = await pool.query("SELECT * FROM interview WHERE application_id = $1 and talent_id = $2", [aid, tid]);
        if (selectQuery.rows.length > 0) {
            //console.log("interview is created");
            res.json({ status: 1, data: selectQuery.rows });
        } else {
            res.json({ status: 0, message: "No Data." });
        }

    } catch (err) {
        console.log(err.message);
    }
})

//'PUT' method to edit interview details by interview id
app.route('/update/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const body = req.body;
        const columns = Object.keys(body);
        const values = columns.map(col => body[col]);
        const placeholders = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const updateQuery = await pool.query(`UPDATE interview SET ${placeholders} WHERE interview_id = $${columns.length + 1}`, [...values, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "Updation successfull" };
        } else {
            response.status = 0;
            response.data = { message: "Updationd failed" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

module.exports = app;