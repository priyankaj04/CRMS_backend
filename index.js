const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser')

const talent = require('./routers/talent');
//const resume = require('./routers/resume');
//const application = require('./routers/application');
//const recruiter = require('./routers/recruiter');

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('x-powered-by')

app.listen(8000, () => {
    console.log(`Example app listening on port 8000`)
})

app.use('/api/talent', talent);
//app.use('/api/resume', resume);
//app.use('/api/application', application);
//app.use('/api/recruiter', recruiter);