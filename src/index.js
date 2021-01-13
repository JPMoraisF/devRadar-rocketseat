require ('dotenv').config({
    path: process.env.NODE_ENV === "test" ? ".env.local" : ".env"
})
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

mongoose.connect(process.env.DEV_RADAR_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.listen(process.env.PORT);