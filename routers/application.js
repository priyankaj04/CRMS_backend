const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');

//"POST" method for creating a new application
app.route('/create/:id').post(async (req, res) => {
    const id = req.params.id;
    try {
        let body = req.body;
        body.status = "pending";
        body.created_at = new Date();
        body.recruiter_id = id;
        body.application_id = uuidv4();
        const columns = Object.keys(body);
        const values = Object.values(body);
        const createQuery = await pool.query(`INSERT INTO application (${columns.join(', ')}) VALUES (${generatePlaceholders(values)}) RETURNING *`, values);
        res.json({ status: 1, data: createQuery.rows });
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

// Function to generate placeholders for parameterized queries
function generatePlaceholders(values) {
    const placeholders = [];
    let index = 1;
    values.forEach(() => {
        placeholders.push(`$${index}`);
        index++;
    });
    return placeholders.join(', ');
}

//"PUT" method for Approving a new application
app.route('/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const status = req.body.status;
        console.log(req.body.status)
        const currentDate = new Date();
        const updated_at = currentDate.toISOString();
        const updateQuery = await pool.query(`UPDATE application SET status = $1, updated_at = $2 WHERE application_id = $3`, [req.body.status, updated_at, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "UPDATION IS SUCCESSFUL" };
        } else {
            response.status = 0;
            response.data = { message: "UPDATION FAILED" };
        }
        res.json(response);
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

// "GET" method for getting recruiter details by recruiter id
app.route('/status').get(async (req, res) => {
    const status = req.query.status;
    const rid = req.query.rid;
    try {
        let response = {};
        let getRecruiterQuery = []
        if (status != 'all') {
            getRecruiterQuery = await pool.query(`SELECT * FROM application WHERE recruiter_id = $1 and status = $2`, [rid, status]);
        } else {
            getRecruiterQuery = await pool.query(`SELECT * FROM application WHERE recruiter_id = $1`, [rid]);
        }
        if (getRecruiterQuery.rows.length > 0) {
            response.status = 1;
            response.data = getRecruiterQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "Recruiter has not posted any jobs" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})


module.exports = app;