const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { Hashpassword, Comparepassword, sendOTPSMS, generateRandomNumber } = require('../src/functions');
const accountSid = "AC898cc801200d08b25192d5143e18a19e";
const authToken = "4cc1279010ff6e0efb700785ba76a0b1";
const client = require("twilio")(accountSid, authToken);
const moment = require('moment');


//"POST" method for recruiter registration
app.route('/registration').post(async (req, res) => {
    try {
        const { company_name, firstname, lastname, email, contactno, password } = req.body;
        const recruiter_id = uuidv4();
        const checkUser = await pool.query("SELECT * FROM recruiter WHERE email = $1", [email]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 0, message: "COMPANY NAME ALREADY EXISTS" });
        } else {
            const encrypt = await Hashpassword(password);

            //haihowareyouisitfine?
            //safecode = F1nnFWBqQYsMgdEHCk529Akj0KkTIcNqMmsPE-7b
            const newRegistration = await pool.query("INSERT INTO recruiter (recruiter_id, company_name, firstname, lastname, email, contactno, password ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [recruiter_id, company_name, firstname, lastname, email, contactno, encrypt]);
            const datetime = moment();
            const newLogger = await pool.query("INSERT INTO recruiter (member, type, datetime ) VALUES ($1, $2, $3) RETURNING *", [email, 'recruiter', datetime]);
            console.log("user is created");
            res.json({ status: 1, data: newRegistration.rows });
        }
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

//"POST" method for recruiter login
app.route('/login').post(async (req, res) => {
    try {
        let response = {};
        const { email, password } = req.body;
        const newLogin = await pool.query("SELECT * FROM recruiter WHERE email = $1", [email]);
        if (newLogin.rows.length == 0) {
            response.status = 0;
            response.data = { message: "EMAIL DOSENT EXISTS" }
        } else {
            const compare = await Comparepassword(password, newLogin.rows[0].password)
            if (compare) {
                const datetime = moment();
                const newLogger = await pool.query("INSERT INTO logger (member, type, datetime ) VALUES ($1, $2, $3) RETURNING *", [email, 'recruiter', datetime]);
                response.status = 1;
                response.data = { message: "SUCCESSFUL LOGIN", recruiter_id: newLogin.rows[0].recruiter_id }
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

//"POST" method to verify email by sending otp
app.route('/verify/:id').post(async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    let response = {};
    try {
        const otp = generateRandomNumber().toString();
        const encrypt = await Hashpassword(otp);
        const query = await pool.query("UPDATE recruiter SET otp = $1 WHERE recruiter_id = $2", [encrypt, id])
        if (query.rowCount > 0) {
            client.messages
                .create({
                    body: `Welcome to Talent connect. Your OTP is ${otp}`,
                    from: '+14026859986',
                    to: `+91${req.body.mobile}`
                })
                .then(message => {
                    if (message.sid) {
                        res.json({ status: 1, message: "Successfull" });
                    }
                }
                ).catch((err) => {
                    console.log("ERROR: ", err);
                    res.json({ status: 0, message: err })
                })
        } else {
            res.json({ status: 0, message: "ID ERROR" });
        }
    } catch (err) {
        res.json({ status: 0, message: err })
        console.log(err.message);
    }
})

//"POST" method to check opt and authorization
app.route('/auth/:id').post(async (req, res) => {
    const id = req.params.id;
    console.log(req.body);
    let response = {};
    try {
        const query = await pool.query("SELECT otp FROM recruiter WHERE recruiter_id= $1", [id])
        console.log(query);
        const auth = await Comparepassword(req.body.otp, query.rows[0].otp);

        if (auth) {
            const updateQuery = await pool.query("UPDATE recruiter SET auth = $1, otp = $2 WHERE recruiter_id = $3", ["1", "0", id])
            console.log("query", updateQuery)
            if (updateQuery.rowCount > 0) {
                response.status = 1;
                response.message = "Successful";
            } else {
                response.status = 0;
                response.message = "Updation failed.";
            }
        } else {
            response.status = 0;
            response.message = "Authentication failed.";
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, message: err })
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

//"PUT" method for updating recruiter details
app.route('/changepassword').put(async (req, res) => {
    const { email, password } = req.body;
    try {
        let response = {};
        const updateQuery = await pool.query(`UPDATE recruiter SET password = $1 WHERE email = $2`, [password, email]);
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