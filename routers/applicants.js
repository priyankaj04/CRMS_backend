const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { Hashpassword, Comparepassword } = require('../src/functions');
const moment = require('moment');

//'POST' method for applicants to apply for the job
app.route('/pitch').post(async (req, res) => {
    try {
        const { application_id, pitching, resume_id, talent_id } = req.body;
        const applicant_id = uuidv4();
        const status = 'under review';
        const checkUser = await pool.query("SELECT * FROM applicants WHERE application_id = $1 and talent_id = $2", [application_id, talent_id]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 0, message: "Applicant already applied to this application" });
        } else {
            const newRegistration = await pool.query("INSERT INTO applicants (applicant_id, application_id, status, pitching, resume_id, talent_id ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [applicant_id, application_id, status, pitching, resume_id, talent_id]);
            console.log("applicant is applied");
            res.json({ status: 1, data: newRegistration.rows });
        }

    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})


//'GET' method for talent to get all applicantions by their talent id in applicants section
app.route('/talent/:id').get(async (req, res) => {
    const id = req.params.id;
    try {
        const checkUser = await pool.query("SELECT * FROM application INNER JOIN applicants ON application.application_id = applicants.application_id WHERE applicants.talent_id = $1", [id]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 1, data: checkUser.rows });
        } else {
            res.json({ status: 0, message: 'No application found' });
        }

    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

//'GET' method for talent to get all applicantions by their talent id in applicants section
app.route('/').get(async (req, res) => {
    const id = req.query.aid;
    try {
        const checkUser = await pool.query("SELECT * FROM applicants where applicant_id = $1", [id]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 1, data: checkUser.rows });
        } else {
            res.json({ status: 0, message: 'No application found' });
        }

    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

//'GET' method for recruiter to get all applicants details by talent id
app.route('/application/:id').get(async (req, res) => {
    const id = req.params.id;
    const status = req.query.status;
    try {
        let checkUser = []
        if (status == 'all') {
            checkUser = await pool.query("SELECT * FROM applicants WHERE application_id= $1", [id]);
        } else {
            checkUser = await pool.query("SELECT * FROM applicants WHERE application_id= $1 and status = $2", [id, status]);
        }
        if (checkUser.rows.length > 0) {
            res.json({ status: 1, data: checkUser.rows });
        } else {
            res.json({ status: 0, message: 'No application found' });
        }

    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

//'GET' method for applicant on application id and talent id
app.route('/details').get(async (req, res) => {
    const id = req.query.aid;
    const tid = req.query.tid;
    try {
        const checkUser = await pool.query("SELECT * FROM applicants WHERE application_id=$1 and talent_id=$2", [id, tid]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 1, data: checkUser.rows });
        } else {
            res.json({ status: 0, message: 'No application found' });
        }

    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

//'PUT' method for recruiters to instantly accept or reject applicants 
app.route('/decision/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const updateQuery = await pool.query(`UPDATE applicants SET status = $1 WHERE applicant_id = $2`, [req.body.status, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "UPDATION IS SUCCESSFUL" };
        } else {
            response.status = 0;
            response.data = { message: "UPDATION FAILED" };
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

//'PUT' method for recruiters to instantly accept or reject applicants 
app.route('/multidecision').put(async (req, res) => {
    try {
        let response = {};
        const updateQuery = await pool.query(`UPDATE applicants SET status = $1 WHERE applicant_id =ANY($2::uuid[])`, [req.body.status, req.body.id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "UPDATION IS SUCCESSFUL" };
        } else {
            response.status = 0;
            response.data = { message: "UPDATION FAILED" };
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

//'PUT' method for applicants for selecting slots
app.route('/updateslot/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const updateQuery = await pool.query(`UPDATE applicants SET selected_slot_date = $1, selected_slot_timings = $2 WHERE applicant_id = $3`, [req.body.slotdate, req.body.slottime, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "UPDATION IS SUCCESSFUL" };
        } else {
            response.status = 0;
            response.data = { message: "UPDATION FAILED" };
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

module.exports = app;