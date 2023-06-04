const express = require('express')
const app = express();
const cors = require('cors');
const pool = require('./database');
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { Hashpassword, Comparepassword } = require('./src/functions');

app.use(express.json());
app.use(cors());


// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world')
})

//"POST" method for student registration
app.post('/registerstudent', async(req, res) => { 
    try {
        const { firstname, lastname, register_no, email, password } = req.body;
        let stud_id = uuidv4();
        const checkUser = await pool.query("SELECT * FROM talent WHERE register_no = $1", [register_no]);
        if (checkUser.rows.length > 0) {
            res.json({ status: 0, message: "REGISTER NUMBER ALREADY EXISTS" });
        } else {
            const encrypt = await Hashpassword(password);
            const newRegistration = await pool.query("INSERT INTO talent (talent_id, firstname, lastname, register_no, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [stud_id, firstname, lastname, register_no, email, encrypt]);
            console.log("user is created");
            res.json({ status: 1, data: newRegistration.rows });
        }
    } catch (err) {
        console.log(err.message);
    }
})

//"POST" method for student login
app.post('/loginstudent', async (req, res) => {
    try {
        let response = {};
        const { register_no, password } = req.body;
        const newLogin = await pool.query("SELECT * FROM talent WHERE register_no = $1", [register_no]);
        if (newLogin.rows.length == 0) {
            response.status = 0;
            response.data = { message: "REGISTER NO DOSENT EXISTS"}
        } else {
            const compare = await Comparepassword(password, newLogin.rows[0].password)
            if(compare) {
                response.status = 1;
                response.data = { message: "SUCCESSFUL LOGIN" }
            } else {
                response.status = 0;
                response.data = { message: "PASSWORD DID NOT MATCH" }
            }
        }
        res.json(response);
    } catch (err) {
        console.log(err.message);
    }
})

//"PUT" method for updating talent details
app.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        console.log(req.body)
        const body = req.body;
        const columns = Object.keys(body);
        const values = columns.map(col => body[col]);
        const placeholders = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const updateQuery = await pool.query(`UPDATE talent SET ${placeholders} WHERE talent_id = $${columns.length + 1}`, [...values, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "UPDATION IS SUCCESSFUL"};
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

//"PUT" method for getting 
app.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        console.log(req.body)
        const body = req.body;
        const columns = Object.keys(body);
        const values = columns.map(col => body[col]);
        const placeholders = columns.map((col, index) => `${col} = $${index + 1}`).join(', ');
        const updateQuery = await pool.query(`UPDATE talent SET ${placeholders} WHERE talent_id = $${columns.length + 1}`, [...values, id]);
        if (updateQuery.rowCount > 0) {
            response.status = 1;
            response.data = { message: "PASSWORD CHANGED SUCCESSFUL" };
        } else {
            response.status = 0;
            response.data = { message: "PASSWORD UPDATION FAILED" };
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

//"GET" method for getting talent details by register no
app.get('/talent/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let response = {};
        const getTalentQuery = await pool.query(`SELECT * FROM talent WHERE register_no = $1`, [id]);
        if (getTalentQuery.rows.length > 0) {
            response.status = 1;
            response.data = getTalentQuery.rows
        } else {
            response.status = 0;
            response.data = { message: "No talent exists with this register no"}
        }
        res.json(response);
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})

app.put('/checkpassword/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let response = {}
        const { password, newpassword } = req.body;
        const pass = await pool.query(`SELECT password FROM talent WHERE talent_id = $1`, [id]);
        console.log(pass);
        if(pass.rowCount > 0) {
        const comparepass =  await Comparepassword(password, pass.rows[0].password);
            if (comparepass) {
                const hashpassword = await Hashpassword(newpassword);
                const updatePassword = await pool.query(`UPDATE talent SET password = $1 WHERE talent_id = $2`, [hashpassword, id]);
                if (updatePassword.rowCount > 0) {
                    response.status = 1;
                    response.data = { message: "UPDATION IS SUCCESSFUL" };
                } else {
                    response.status = 0;
                    response.data = { message: "UPDATION FAILED" };
                }
            } else {
                response.status = 0;
                response.data = { message: "Sorry, the old password you provided is not correct. Please verify and re-enter your previous password." };
            }
            res.json(response);
        }
    } catch (err) {
        res.json({ status: 0, data: { message: err.message } })
        console.log(err.message);
    }
})


app.listen(8000, () => {
    console.log(`Example app listening on port 8000`)
})