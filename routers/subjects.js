const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');

// "GET" method for getting subject details with course
app.route('/course/:course').get(async (req, res) => {
    const course = req.params.course;
    const year = req.query.year;
    console.log(course, year);
    try {
        let response = {};
        const getQuery = await pool.query(`SELECT * FROM subjects WHERE course = $1 and academic_year = $2`, [course, year]);
        if (getQuery.rows.length > 0) {
            response.status = 1;
            response.data = getQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "No subjects added yet." }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

//"PUT" method for updating subjects
app.route('/update/:course').put(async (req, res) => {
    const course = req.params.course;
    const year = req.query.year;
    try {
        console.log(course);
        let body = req.body;
        const getQuery = await pool.query(`SELECT * FROM subjects WHERE course = $1 and academic_year = $2`, [course, year]);
        if (getQuery.rows.length > 0) {
            const updateQuery = await pool.query(`UPDATE subjects SET subject = $1 WHERE course = $3 and academic_year = $4`, [body.subject ,course, year]);
            if (updateQuery.rowCount > 0) {
                res.json({ status: 1, message: "Successfully updated." });
            } else {
                res.json({ status: 0, message: "Updation failed." });
            }
        } else {
            const course_id = uuidv4();
            const createQuery = await pool.query(`INSERT INTO subjects (course_id, course, subject, academic_year, details) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [course_id, course, body.subject, year, body.details]);
            if (createQuery.rows.length > 0) {
                res.json({ status: 1, data: createQuery.rows });
            } else {
                res.json({ status: 1, message: 'Insertion failed.' });
            }
        }
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

module.exports = app;