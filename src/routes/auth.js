const express = require('express');
const passport = require('passport');
require('../strategies/local-strategy');

const authRouter = express.Router();

authRouter.post('/', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ message: "Logged in!"});
});

authRouter.post('/logout', (req,res)=>{
    if(!req.user) return res.sendStatus(401);
    
    req.logOut((err)=>{
        if(err) return res.sendStatus(400);
        return res.status(200).json({message: 'Logged out!'});
    })
});

authRouter.post('/status', (req, res) => {
    return req.user ? res.status(200).json({message: `User: ${req.user.id} is logged in`}) : res.status(401).json({message: 'Not Authorized'});
});

module.exports = authRouter;


