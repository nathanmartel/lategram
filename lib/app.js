const express = require('express');
const app = express();

app.use(express.json());

app.use('/auth', require('./routes/auths.js'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
