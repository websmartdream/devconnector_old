const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
require('express-async-errors');
const errorMW = require('./middleware/error');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();


// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use(errorMW);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on: ${port}`));
