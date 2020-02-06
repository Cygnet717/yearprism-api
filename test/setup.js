const {expect} = require('chai')
process.env.NODE_ENV = 'test'
const supertest = require('supertest')
require('dotenv').config()

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || "postgresql://ultimatetutor@localhost/ultimatetutor-test"

global.expect = expect
global.supertest = supertest