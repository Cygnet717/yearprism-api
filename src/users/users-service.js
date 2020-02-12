const xss = require('xss');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    validatePassword(password) {
        if (password.length < 8) {
          return 'Password must be longer than 8 characters'
        }
        if (password.length > 72) {
          return 'Password must be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
          return 'Password must not start or end with empty spaces'
      }
      if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
          return 'Password must contain 1 upper case, lower case, number and special character'
      }
      return null
    },
    
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },

    hasUserWithUserName(db, username) {
        return db('yp_users')
        .where({ username })
        .first()
        .then(user => !!user)
    },

    insertUser(db, newUser) {
        return db
        .insert(newUser)
        .into('yp_users')
        .returning('*')
        .then(([user]) => user)
    },

    serializeUser(user) {
        return {
            user_id: user.user_id,
            birthyear: user.birthyear,
            username: xss(user.username),
        }
    },

    createJwt(subject, payload){
        console.log('creating jwt')
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256',
        })
        
    },

    getUsers(db){
        return db
        .select('*')
        .from('yp_events')
    }
}

module.exports = UsersService