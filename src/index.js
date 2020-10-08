const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes.js');

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://backend-app:servidorDev@dev-01.tah9s.gcp.mongodb.net/dev-01?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(routes);

app.listen(4444);