const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Login Endpoints', function() {
    let db 

    const testUsers = helpers.makeTestUserFixtures();
    
    const SampleTestUser = testUsers.usersArray[0];

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

    describe(`POST /api/login`, () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(db, testUsers.usersArray)
        })

            const loginAttemptBody = {
                username: SampleTestUser.username,
                password: SampleTestUser.password
            }
            
        
        it(`Happy path`, () => {
            const expectedToken = jwt.sign(
                {user_id: SampleTestUser.user_id}, 
                process.env.JWT_SECRET,
                {
                    subject: SampleTestUser.username,
                    expiresIn:'3h',
                    algorithm: 'HS256',
                }
            )

            return supertest(app)
            .post('/api/login')
            .send(loginAttemptBody)
            .expect(400,
                {
                    authToken: expectedToken,
                    payload: {
                        user_id: SampleTestUser.user_id,
                        
                    }
                }
                )
        })
    })
})