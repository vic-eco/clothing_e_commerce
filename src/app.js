const session = require('express-session');
const express = require('express');
const passport = require('passport');
const app = express();

require('dotenv').config();

app.use(express.json());

//Session setup
app.use(
    session({
    secret: process.env.SESSION_SECRET,  //used to sign the cookie
    saveUninitialized: false, //doesn't save random sessions in memory
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 24, //expires after 24 hours
    }
}));

//Authentication setup
app.use(passport.initialize());
app.use(passport.session());

const auth = require('./routes/auth');
const userRouter = require('./routes/user');

app.use('/api/auth', auth);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`Server started at http://localhost:${PORT}`);
});

