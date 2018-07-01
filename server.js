const mongoose = require('mongoose');
const express = require('express');
const app = express();

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');


// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on: ${port}`));
