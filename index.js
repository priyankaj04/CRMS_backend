const express = require('express')
const app = express();
const cors = require('cors');

const routes = require('./routers/index');

app.use(express.json());
app.use(cors());


// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world')
})


app.use('/api', routes)

app.listen(8000, () => {
    console.log(`Example app listening on port 8000`)
})