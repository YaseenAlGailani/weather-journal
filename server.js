const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());
app.use(cors());

const port = 3000;

// App endpoint
const projectData = {};

app.use(express.static('website'));

app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});