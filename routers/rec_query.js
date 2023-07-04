const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');

//"POST" method for creating a new application
app.route('/create/:id').post(async (req, res) => {
    const id = req.params.id;
    try {
        const checkQuery = await pool.query(`SELECT * FROM talent WHERE talent_id = $1`, id);
        if (checkQuery.rows.length > 0) {
            let body = req.body;
            body.rec_id = uuidv4();
            const columns = Object.keys(body);
            const values = Object.values(body);
            const createQuery = await pool.query(`INSERT INTO rectification_query(${columns.join(', ')}) VALUES (${generatePlaceholders(values)}) RETURNING *`, values);
            res.json({ status: 1, data: createQuery.rows });
        } else {
            res.json({ status: 0, message: "Talent id do not exists" });
        }

    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

// "GET" method for getting query details by talent id
app.route('/queries/:id').get(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const getQuery = await pool.query(`SELECT * FROM rectification_query WHERE talent_id = $1`, [id]);
        if (getQuery.rows.length > 0) {
            response.status = 1;
            response.data = getQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "No queries yet." }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

// "GET" method for getting all query details 
app.route('/allqueries').get(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const getQuery = await pool.query(`SELECT * FROM rectification_query`);
        if (getQuery.rows.length > 0) {
            response.status = 1;
            response.data = getQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "No queries yet." }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

//"PUT" method for reply to query
app.route('/update/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let body = req.body;
        body.updated_at = new Date();
        const updateQuery = await pool.query(`UPDATE rectification_query SET reply = $1, updated_at = $2 WHERE rec_id = $3`, [body.reply, body.updated_at, id]);
        if (updateQuery.rowCount > 0) {
            res.json({ status: 1, message: "Successfully updated." });
        } else {
            res.json({ status: 0, message: "Updation failed." });
        }
        
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

module.exports = app;