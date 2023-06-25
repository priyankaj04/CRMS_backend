const express = require('express');
const app = express.Router();
const pool = require('../database');
const { Hashpassword, Comparepassword, sendOTPSMS, generateRandomNumber } = require('../src/functions');
const nodemailer = require('nodemailer');
const accountSid = "AC898cc801200d08b25192d5143e18a19e";
const authToken = "788889cef2103fe15062ae4c74d34c6c";
const client = require("twilio")(accountSid, authToken);

//"POST" method for forgot password sending otp
app.route('/verify/:type').post(async (req, res) => {
    const type = req.params.type;
    console.log(type);
    let response = {};
    try {
        var checkUser = [];
        if (type == 'talent') {
            checkUser = await pool.query("SELECT * FROM talent WHERE email = $1", [req.body.email]);
        } else if (type == 'recruiter') {
            checkUser = await pool.query("SELECT * FROM recruiter WHERE contactno = $1", [req.body.mobile]);
        }
        console.log("is there error here", checkUser)

        if (checkUser.rows.length > 0) {
            console.log("is there error here")
            const otp = generateRandomNumber().toString();
            const encrypt = await Hashpassword(otp);
            var query = [];
            if (type == 'talent') {
                query = await pool.query("UPDATE talent SET otp = $1 WHERE email = $2", [encrypt, req.body.email]);
                const mailOptions = {
                    from: 'priyankaj_r20@bmscw.edu.in',
                    to: req.body.email,
                    subject: 'Your OTP',
                    text: `Your One-Time Password (OTP) is: ${otp}`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        response.status = 0;
                        response.message = "OTP failed."
                        res.json(response);
                    } else {
                        console.log('OTP email sent successfully');
                        response.status = 1;
                        response.message = "OTP sent successfully."
                        res.json(response);
                        return true;
                    }
                });
            } else if (type == 'recruiter') {
                query = await pool.query("UPDATE recruiter SET otp = $1 WHERE contactno = $2", [encrypt, req.body.mobile]);
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
            }

        } else {
            console.log('No email exists');
            response.status = 0;
            response.message = "Given email does not exist in our record. Please enter correct email address.";
            res.json(response);
        }
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail'
    auth: {
        user: 'priyankaj_r20@bmscw.edu.in',
        pass: 'hdzcnjiifflcruhe',
    },
});

//"PUT" method for changing password by email address
app.route('/otp/:type').put(async (req, res) => {
    const type = req.params.type;
    try {

        let checkUser = [];
        if (type == "talent") {
            checkUser = await pool.query("SELECT otp FROM talent WHERE email = $1", [req.body.email]);
        } else if (type == "recruiter") {
            checkUser = await pool.query("SELECT otp FROM recruiter WHERE contactno = $1", [req.body.mobile]);
        }
        console.log("password ", checkUser.rows[0].otp)
        const auth = await Comparepassword(req.body.otp, checkUser.rows[0].otp)
        if (auth) {
            res.json({ status: 1, message: "Correct OTP" })
        } else {
            res.json({ status: 0, message: "Incorrect OTP" })
        }
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

// "PUT" method for changing password by email address
app.route('/:type').put(async (req, res) => {
    const type = req.params.type;
    try {
        let checkUser = [];
        console.log("Checking users", req.body);
        const encrypt = await Hashpassword(req.body.password);
        console.log("type", type);
        if (type == "talent") {
            checkUser = await pool.query("UPDATE talent SET password = $1, otp = $2 WHERE email = $3", [encrypt, "0", req.body.email]);
        } else if (type == 'recruiter') {
            checkUser = await pool.query("UPDATE recruiter SET password = $1, otp = $2 WHERE contactno = $3", [encrypt, "0", req.body.mobile]);
        }
        if (checkUser.rowCount > 0) {

            res.json({ status: 1, message: "Password updated successfully." })
        } else {
            res.json({ status: 0, message: "Given email do not exists." })
        }
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

module.exports = app;