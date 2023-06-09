const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { Hashpassword, Comparepassword } = require('../src/functions');

//"POST" method for recruiter registration
app.route('/registration').post(async (req, res) => {
    try {
        const { company_name, firstname, lastname, email, contactno, password } = req.body;
        const recruiter_id = uuidv4();
        const checkUser = await pool.query("SELECT * FROM recruiter WHERE company_name = $1", [company_name]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 0, message: "COMPANY NAME ALREADY EXISTS" });
        } else {
            const encrypt = await Hashpassword(password);
            const newRegistration = await pool.query("INSERT INTO recruiter (recruiter_id, company_name, firstname, lastname, email, contactno, password ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [recruiter_id, company_name, firstname, lastname, email, contactno, encrypt]);
            console.log("user is created");
            res.json({ status: 1, data: newRegistration.rows });
        }
    } catch (err) {
        console.log(err.message);
        res.json({status: 0, message: err.message });
    }
})

//"POST" method for recruiter login
app.route('/login').post(async (req, res) => {
    try {
        let response = {};
        const { company_name, password } = req.body;
        const newLogin = await pool.query("SELECT * FROM recruiter WHERE company_name = $1", [company_name]);
        if (newLogin.rows.length == 0) {
            response.status = 0;
            response.data = { message: "COMPANY DOSENT EXISTS" }
        } else {
            const compare = await Comparepassword(password, newLogin.rows[0].password)
            if (compare) {
                response.status = 1;
                response.data = { message: "SUCCESSFUL LOGIN", recruiter_id: newLogin.rows[0].recruiter_id}
            } else {
                response.status = 0;
                response.data = { message: "PASSWORD DID NOT MATCH" }
            }
        }
        res.json(response);
    } catch (err) {
        console.log(err.message);
    }
})


//----------------------------------------------------------------


// "GET" method for getting recruiter details by recruiter id
app.route('/:id').get(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const getRecruiterQuery = await pool.query(`SELECT * FROM recruiter WHERE recruiter_id = $1`, [id]);
        if (getRecruiterQuery.rows.length > 0) {
            response.status = 1;
            response.data = getRecruiterQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "No recruiter exists with this id" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})


//----------------------------------------------------------------


//"PUT" method for updating recruiter details
app.route('/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        console.log(req.body)
        const body = req.body;
        const columns = Object.keys(body);
        const values = columns.map(col => body[col]);
        const placeholders = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const updateQuery = await pool.query(`UPDATE recruiter SET ${placeholders} WHERE recruiter_id = $${columns.length + 1}`, [...values, id]);
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

//'PUT' method to change password
app.route('/changepassword/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {}
        const { password, newpassword } = req.body;
        const pass = await pool.query(`SELECT password FROM recruiter WHERE recruiter_id = $1`, [id]);
        console.log(pass);
        if (pass.rowCount > 0) {
            const comparepass = await Comparepassword(password, pass.rows[0].password);
            if (comparepass) {
                const hashpassword = await Hashpassword(newpassword);
                const updatePassword = await pool.query(`UPDATE recruiter SET password = $1 WHERE recruiter_id = $2`, [hashpassword, id]);
                if (updatePassword.rowCount > 0) {
                    response.status = 1;
                    response.data = { message: "UPDATION IS SUCCESSFUL" };
                } else {
                    response.status = 0;
                    response.data = { message: "UPDATION FAILED" };
                }
            } else {
                response.status = 0;
                response.data = { message: "Sorry, the old password you provided is not correct. Please verify and re-enter your previous password." };
            }
            res.json(response);
        }
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

module.exports = app;