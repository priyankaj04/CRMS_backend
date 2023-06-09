const express = require('express');
const app = express.Router();
const pool = require('../database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');


// "POST" method for creating and updating resume by talent_id
app.route('/update/:id').post(async (req, res) => {
    const id = req.params.id;
    let response = {};
    let body = req.body;
    try {
        console.log(body);
        const getResumeQuery = await pool.query(`SELECT * FROM resume WHERE talent_id = $1`, [id]);
        //console.log(getResumeQuery.rows[0]["education"][0].school)
        if (getResumeQuery.rows.length > 0) { // if id already exists, then update it
            //console.log("into update block");
            const resume_id = getResumeQuery.rows[0].resume_id;
            const { setClause, parameterValues } = generateSetClauseAndValues(body);
            const query = `UPDATE resume SET ${setClause} WHERE resume_id = $1`;
            const parameters = [resume_id, ...parameterValues];
            const updateResumeQuery = await pool.query(query, parameters);
            //console.log(updateResumeQuery);
            response.status = 1;
            response.data = { message: "SUCCESSFULLY UPDATED"};
            res.json(response);
        } else { // else create new one
            body.talent_id = id;
            body.resume_id = uuidv4();
            //console.log(body);
            const columns = Object.keys(body).join(', ');
            const values = Object.values(body);
            //const placeholders = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
            const createResume = await pool.query(`INSERT INTO resume (${columns}) VALUES (${generatePlaceholders(values)}) RETURNING *`, values);
            //console.log(createResume);
            response.status = 1;
            response.data = [createResume.rows[0]];
            res.json(response);
        }
    } catch (err) {
        console.log(err.message);
        response.status = 0;
        response.data = { message: err.message };
        res.json(response);
    }
})

function generatePlaceholders(values) {
    let placeholders = '';
    for (let i = 1; i <= values.length; i++) {
        placeholders += `$${i}${i !== values.length ? ', ' : ''}`;
    }
    return placeholders;
}

function generateSetClauseAndValues(items) {
    const columns = Object.keys(items);
    const setValues = columns.map((column, index) => {
        return `${column} = $${index + 2}`; // Start index from 2 to account for the ID parameter
    });
    const parameterValues = Object.values(items);
    return {
        setClause: setValues.join(', '),
        parameterValues: parameterValues,
    };

}


// "GET" method for getting resume details by talent_id
app.route('/talent/:id').get(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const getResumeQuery = await pool.query(`SELECT * FROM resume WHERE talent_id = $1`, [id]);
        if (getResumeQuery.rows.length > 0) {
            response.status = 1;
            response.data = getResumeQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "No resume exists with this talent_id" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

module.exports = app;