const express = require('express');
//const AuthService = require('./auth-service');

const loginRouter = express.Router();
const jsonBodyParser = express.json();

loginRouter
    .post('/', jsonBodyParser, (req, res, next)=> {
        res.send('login , world!')
    })

module.exports = loginRouter;