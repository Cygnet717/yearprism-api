const express = require('express');
const LoginUserService = require('./loginUser-service');

const loginRouter = express.Router();
const jsonBodyParser = express.json();

loginRouter
    .post('/', jsonBodyParser, (req, res, next)=> {
        const {username, password} = req.body
      const loginUser = {username, password}

      for (const [key, value] of Object.entries(loginUser))
      if(value == null)
      return res.status(400).json({
          error: `Missing '${key}' in request body`
      })
      LoginUserService.getUserWithUserName(
          req.app.get('db'),
        loginUser.username
      )
      .then(dbUser => {
          if(!dbUser){
          return res.status(400).json({
              error: 'Incorrect user_name or password'
          })}

          return LoginUserService.comparePasswords(loginUser.password, dbUser.password)

          .then(compareMatch => {
              if(!compareMatch)
              return res.status(400).json({
                  error: 'Incorrect user_name or password',
              })

              
              const sub = dbUser.username
              const payload = { user_id: dbUser.user_id }
              res.send({
                  authToken: LoginUserService.createJwt(sub, payload),
                  payload,
              })
              
          })
      })
      .catch(next)
    })

module.exports = loginRouter;