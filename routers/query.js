const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const moment = require('moment');

// "GET" method for getting all queries
app.route('/allquery').get(async (req, res) => {
    try {
        let response = {};
        const getAllQueries = await pool.query(`SELECT * FROM query`);
        if (getAllQueries.rows.length > 0) {
            response.status = 1;
            response.data = getAllQueries.rows
        } else {
            response.status = 0;
            response.data = { message: "No queries so far!" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

// "GET" method for getting all queries for that id
app.route('/:id').get(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const getAllQueries = await pool.query(`SELECT * FROM query WHERE id = $1`, [id]);
        if (getAllQueries.rows.length > 0) {
            response.status = 1;
            response.data = getAllQueries.rows
        } else {
            response.status = 0;
            response.data = { message: "No queries so far!" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

//"POST" method for query parameters
app.route('/newquery').post(async (req, res) => {
    try {
        const { type, id, email, fullname, contact_no, message } = req.body;
        const query_id = uuidv4();
        const date = moment().format();
        const newQuery = await pool.query("INSERT INTO query (query_id, type, id, email, fullname, contact_no, message, status, created_at ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *", [query_id, type, id, email, fullname, contact_no, message, "sent", date]);
        console.log("query is created");
        res.json({ status: 1, data: newQuery.rows });
    } catch (err) {
        console.log(err.message);
    }
})

//"PUT" method for replying for query by query id
app.route('/replyquery/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const { reply } = req.body;
        const updated_at = new Date().toISOString();
        const status = "replied";
        const updateQuery = await pool.query("UPDATE query SET reply = $1, updated_at = $2, status = $3 WHERE query_id = $4", [reply, updated_at, status, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "UPDATION IS SUCCESSFUL" };
        } else {
            response.status = 0;
            response.data = { message: "UPDATION FAILED" };
        }
        res.json(response);
    } catch (err) {
        response.status = 0;
        response.data = { message: err.message };
        console.log(err.message);
    }
})

module.exports = app;