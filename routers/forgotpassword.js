const express = require('express');
const app = express.Router();
const pool = require('../database');
const { Hashpassword, Comparepassword, sendOTPSMS } = require('../src/functions');

//"POST" method for forgot password sending otp
app.route('/verify/:type').post(async (req, res) => {
    const type = req.params.type;
    try {
        const checkUser = await pool.query("SELECT * FROM $1 WHERE email = $2", [type, req.body.email]);
        if (checkUser.rows.length > 0) {
            const otp = generateRandomNumber().toString();
            const encrypt = await Hashpassword(otp);
            const query = await pool.query("UPDATE $1 SET otp = $2 WHERE email = $3", [type, encrypt, req.body.email])
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
        } else {
            console.log('No email exists');
            response.status = 1;
            response.message = "Given email does not exist in our record. Please enter correct email address.";
            res.json(response);
        }
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

//"PUT" method for changing password by email address
app.route('/otp/:type').put(async (req, res) => {
    const type = req.params.type;
    try {
        const checkUser = await pool.query("SELECT otp FROM $1 WHERE email = $2", [type, req.body.email]);
        const auth = await Comparepassword(checkUser.rows[0].otp, req.body.otp)
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
        const checkUser = await pool.query("UPDATE $1 SET password = $2, otp = $3 WHERE email = $4", [type, req.body.password, "0", req.body.email]);
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