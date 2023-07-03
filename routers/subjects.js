const express = require('express');
const app = express.Router();
const pool = require('../database');

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

module.exports = app;