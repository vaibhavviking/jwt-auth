const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const Keys = require('./config/keys');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = Keys.mongodb.dbURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => {
    console.log('connected to mongodb');
    app.listen(3000)
  })
  .catch((err) => console.log(err));

// routes
app.use(authRoutes);

app.get('*', checkUser);

app.get('/', (req, res) => res.render('home'));

app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));


app.get('/set-cookies', (req, res) => {
  res.cookie('newUser', false, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

})

app.get('/read-cookies', (req, res) => {

})