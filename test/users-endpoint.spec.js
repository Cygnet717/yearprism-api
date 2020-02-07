const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function() {
    let db 

    const testUsers = helpers.makeTestUserFixtures();
    const testUser = testUsers.usersArray[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
          })
          app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(db, testUsers.usersArray)
        })

        const happyUser = {
            "username": "HappyUser",
            "birthyear": "1986",
            "password": "Password!1"
        }

        it(`Happy path`, () => {
            return supertest(app).post('/api/users').send(happyUser)
            .expect(201,
                {
                    "user_id": 1,
                    "username": "HappyUser"
                }
                )
        })
    })
})