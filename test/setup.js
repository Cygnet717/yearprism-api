const {expect} = require('chai')
process.env.NODE_ENV = 'test'
const supertest = require('supertest')
require('dotenv').config()

process.env.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL
  || "postgresql://katge@localhost/yearprismtest"

//process.env.TEST_DATABASE_URL = process.env.DATABASE_URL

global.expect = expect
global.supertest = supertest