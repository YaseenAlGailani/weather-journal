const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 3000;
// App endpoint
let projectData = {};

app.use(bodyParser.urlencoded({ 'extended': false }));
app.use(bodyParser.json());
app.use(cors());


app.use(express.static('website'));

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

app.post('/new-entry', (req, resp) => {
    projectData = req.body;
    resp.send("[APP.JS] data received");
});

app.get('/all', (req, resp) => {
    resp.send(JSON.stringify(projectData));
});