const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
require('../backend/config/passport.js');
const MongoStore = require('connect-mongo');

const routes = require('./routes/routes.js');
const db = require('./models/db.js');

const app = express();
const port = process.env.PORT | 4000;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // Use 'Lax' or 'Strict' for SameSite in development
    sameSite: 'Lax',  // 'Lax' is more lenient and works well for local dev environments
    secure: false,  // Set to false in development (HTTP)
    maxAge: 1000 * 60 * 60,  // 1 hour
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // React frontend
    credentials: true,  // Allow credentials (cookies) to be sent
  }));

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/', routes);

// app.use((req, res, next) => {
//     console.log('Current Session:', req.session);
//     console.log('Passport Data:', req.session.passport);
//     next();
//   });

app.use(function (req, res) {
    res.render('error');
});

db.connect();

app.listen(port, function(){
    console.log('Server running at: ');
    console.log('app listening at port ' + port);
});

