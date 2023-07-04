const express = require('express');
const app = express.Router();
const pool = require('../database');

//"POST" method for creating a new subjects with course
app.route('/create').post(async (req, res) => {
    try {
        const body = req.body;
        
        
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

// "GET" method for getting subject details with course
app.route('/course/:course').get(async (req, res) => {
    const course = req.params.course;
    try {
        let response = {};
        const getQuery = await pool.query(`SELECT * FROM subjects WHERE course = $1`, [course]);
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
    try {
        let body = req.body;
        const getQuery = await pool.query(`SELECT * FROM subjects WHERE course = $1`, [course]);
        if (getQuery.rows.length > 0) {
            const updateQuery = await pool.query(`UPDATE subjects SET subject = $1 WHERE course = $2`, [body, course]);
            if (updateQuery.rowCount > 0) {
                res.json({ status: 1, message: "Successfully updated." });
            } else {
                res.json({ status: 0, message: "Updation failed." });
            }
        } else {
            const createQuery = await pool.query(`INSERT INTO subjects (course, subject) VALUES ($1, $2) RETURNING *`, [course, body]);
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