const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
const config = require('../src/config');

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

    describe(`api/users`, () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(db, testUsers.usersArray)
        })
        
        const happyUser = {
            "username": "HappyUser",
            "birthyear": 1986,
            "password": "Password!1"
        }

        const cleanHappyUser = helpers.serializeUser(happyUser) 

        it(`Post Users Happy path successfully adds new user`, () => {
            const expectedToken = jwt.sign(
                {user_id: 1}, 
                config.JWT_SECRET,
                {
                    subject: cleanHappyUser.username,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256',
                }
            )
            return supertest(app).post('/api/users').send(happyUser)
            .expect(201,
                {"authToken":expectedToken, user: {
                    username: happyUser.username, 
                    user_id: 1,
                    birthyear: parseInt(happyUser.birthyear)
                }
            }
                )
        })

        it('GET Users responds with user info', () => {
            return supertest(app)
            .get('/api/users')
            .expect(200)
        })
    })
})