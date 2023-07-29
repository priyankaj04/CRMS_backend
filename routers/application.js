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

//"PUT" method for Approving a new application
app.route('/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const currentDate = new Date();
        const updated_at = currentDate.toISOString();
        const updateQuery = await pool.query(`UPDATE application SET status = $1, updated_at = $2 WHERE application_id = $3`, [req.body.status, updated_at, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "UPDATION IS SUCCESSFUL" };
        } else {
            response.status = 0;
            response.data = { message: "UPDATION FAILED" };
        }
        res.json(response);
    } catch (err) {
        console.log(err.message);
        res.json({ status: 0, message: err.message });
    }
})

// "GET" method for getting recruiter details by recruiter id
app.route('/status').get(async (req, res) => {
    const status = req.query.status;
    const rid = req.query.rid;
    try {
        let response = {};
        let getRecruiterQuery = []
        if (status != 'all') {
            getRecruiterQuery = await pool.query(`SELECT * FROM application WHERE recruiter_id = $1 and status = $2`, [rid, status]);
        } else {
            getRecruiterQuery = await pool.query(`SELECT * FROM application WHERE recruiter_id = $1`, [rid]);
        }
        if (getRecruiterQuery.rows.length > 0) {
            response.status = 1;
            response.data = getRecruiterQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "Recruiter has not posted any jobs" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

// "GET" method for getting application details by application id
app.route('/:id').get(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const getApplicationQuery = await pool.query(`SELECT * FROM application WHERE application_id = $1`, [id]);

        if (getApplicationQuery.rows.length > 0) {
            response.status = 1;
            response.data = getApplicationQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "Recruiter has not posted any jobs" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

// "PUT" method to edit application details by application id
app.route('/update/:id').put(async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const body = req.body;
        const columns = Object.keys(body);
        const values = columns.map(col => body[col]);
        const placeholders = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const updateQuery = await pool.query(`UPDATE application SET ${placeholders} WHERE application_id = $${columns.length + 1}`, [...values, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = updateQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "Recruiter has not posted any jobs" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

// "PUT" method to put saved ids
app.route('/save/id').put(async (req, res) => {
    const aid = req.body.aid;
    const tid = req.body.tid;
    try {
        console.log(aid, tid);
        let response = {};
        const updateQuery = await pool.query(`
  UPDATE talent 
  SET saved = 
    CASE 
      WHEN saved IS NULL THEN ARRAY[$1::uuid] 
      ELSE array_cat(saved, ARRAY[$1::uuid])
    END 
  WHERE talent_id = $2
`, [aid, tid]);

        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = updateQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "Updations Failed" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

// "PUT" method to put saved ids
app.route('/save/remove').put(async (req, res) => {
    const aid = req.body.aid;
    const tid = req.body.tid;
    try {
        let response = {};
        const updateQuery = await pool.query(`UPDATE talent SET saved = array_remove(saved, $1::uuid) WHERE talent_id = $2`, [aid, tid]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = updateQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "Updations Failed" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

// "PUT" method to edit application details by application id
app.route('/save/application').put(async (req, res) => {
    //const aid = req.body.aid;
    try {
        let response = {};
        console.log("sdfasdfsdfsdfsdsf")
        const updateQuery = await pool.query(`SELECT * FROM application WHERE application_id = ANY($1::uuid[]);`, [req.body.aid]);
        console.log(updateQuery);
        if (updateQuery.rows.length > 0) {
            response.status = 1;
            response.data = updateQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "Updations Failed" }
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})


module.exports = app;