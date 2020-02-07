const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Users Endpoints', function() {
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
    helpers.seedUsers(db, testUsers.usersArray)
    //after('disconnect from db', () => db.destroy())
    //before('cleanup', () => helpers.cleanTables(db))
    //afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`POST /api/users`, () => {
        //beforeEach('insert users', () => {
        //    helpers.seedUsers(db, testUsers.usersArray)
        //})

        const happyUser = {
            "username": "HappyUser",
            "birthyear": 1986,
            "password": "Password!1"
        }

        it(`Happy path successfully adds new user`, () => {
            return supertest(app).post('/api/users').send(happyUser)
            .expect(201,
                {
                    "user_id": 1,
                    "birthyear": happyUser.birthyear,
                    "username": happyUser.username
                }
                )
        })
    })
})