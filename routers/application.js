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


module.exports = app;