const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

const talent = require('./routers/talent');
const resume = require('./routers/resume');
const application = require('./routers/application');
const recruiter = require('./routers/recruiter');
const query = require('./routers/query');
const admin = require('./routers/admin');
const student = require('./routers/student');
const forgotpassword = require('./routers/forgotpassword');

app.use(express.json());
app.use(cors());
app.use(express.json({ limit: "50mb", extended: true }))
app.use(express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
//app.use(bodyParser.json({ limit: "5000mb", extended: true, type: 'application/json' }));
//app.use(bodyParser.urlencoded({ extended: true, limit: '5000mb', parameterLimit: 15000000 }));
app.disable('x-powered-by')

app.listen(8000, () => {
    console.log(`Example app listening on port 8000`)
})

app.use('/api/talent', talent);
app.use('/api/resume', resume);
app.use('/api/application', application);
app.use('/api/recruiter', recruiter);
app.use('/api/query', query);
app.use('/api/admin', admin);
app.use('/api/student', student);
app.use('/api/forgotpassword', forgotpassword);