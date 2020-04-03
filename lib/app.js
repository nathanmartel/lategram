const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/auth', require('./routes/auths.js'));
app.use('/posts', require('./routes/posts.js'));
app.use('/comments', require('./routes/comments.js'));
app.use('/users', require('./routes/users.js'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
