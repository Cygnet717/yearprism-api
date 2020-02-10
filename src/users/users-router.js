const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .get('/', (req, res, next)=> {
        UsersService.getUsers(req.app.get('db'))
        .then(users => {res.json(users)})
    })
    .post('/', jsonBodyParser, (req, res, next)=> {
        const { password, birthyear, username } = req.body

        for(const field of ['username', 'birthyear', 'password'])
        if(!req.body[field])
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
        
        const passwordError = UsersService.validatePassword(password)

        if(passwordError)
        return res.status(400).json({ error: passwordError})

        UsersService.hasUserWithUserName(req.app.get('db'), username)
        .then(hasUserWithUserName => {
            if(hasUserWithUserName)
            return res.status(400).json({ error: `That username is already taken`})

            return UsersService.hashPassword(password)
            .then(hashedPassword => {
                const newUser = {
                    username,
                    birthyear,
                    password: hashedPassword
                }

                return UsersService.insertUser(req.app.get('db'), newUser)
                .then(user => {
                    res.status(201)
                    .location(path.posix.join(req.originalUrl, `./${user.user_id}`))
                    .json(UsersService.serializeUser(user))
                })
            })
        })
        .catch(next)
    })

    module.exports = usersRouter;