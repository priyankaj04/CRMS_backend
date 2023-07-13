const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');

//"POST" method for student registration
app.route('/create').post(async (req, res) => {
    try {
        const { register_no, classes, degree, stream, semester, CGPA, backlog_number, backlog_subject, email, tenth_details, twelth_details, ug_details, subject_marks, batch } = req.body;
        const student_id = uuidv4();
        const checkUser = await pool.query("SELECT * FROM student WHERE register_no = $1", [register_no]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 0, message: "REGISTER NUMBER ALREADY EXISTS" });
        } else {
            const newRegistration = await pool.query("INSERT INTO student (student_id, register_no, class , degree, stream, semester, CGPA, backlog_number, backlog_subject, email, tenth_details, twelth_details, ug_details, subject_marks, batch) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *", [student_id, register_no, classes, degree, stream, semester, CGPA, backlog_number, backlog_subject, email, tenth_details, twelth_details, ug_details, subject_marks, batch]);
            console.log("student is created");
            res.json({ status: 1, data: newRegistration.rows });
        }
    } catch (err) {
        console.log(err.message);
    }
})

//----------------------------------------------------------------


// "GET" method for getting student details by email
app.route('/email/:email').get(async (req, res) => {
    const email = decodeURIComponent(req.params.email);
    try {
        let response = {};
        const getStudentQuery = await pool.query(`SELECT * FROM student WHERE email = $1`, [email]);
        if (getStudentQuery.rows.length > 0) {
            response.status = 1;
            response.data = getStudentQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "No students exists with this student register number" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

// "GET" method for getting studnet details by student class
app.route('/class/:classes').get(async (req, res) => {
    const classes = req.params.classes;
    try {
        let response = {};
        const getStudentQuery = await pool.query(`SELECT * FROM student WHERE class = $1`, [classes]);
        if (getStudentQuery.rows.length > 0) {
            response.status = 1;
            response.data = getStudentQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "No students created from this class yet." }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})


//----------------------------------------------------------------


//"PUT" method for updating student details
app.route('/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        console.log(req.body)
        const body = req.body;
        const columns = Object.keys(body);
        const values = columns.map(col => body[col]);
        const placeholders = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const updateQuery = await pool.query(`UPDATE student SET ${placeholders} WHERE student_id = $${columns.length + 1}`, [...values, id]);
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