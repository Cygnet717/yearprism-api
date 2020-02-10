const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');
const bcrypt = require('bcryptjs');
const config = require('../src/config');

describe.only('Login Endpoints', function() {
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
            const preppedUsers = testUsers.usersArray.map(user => ({
                ...user,
                password: bcrypt.hashSync(user.password, 1)
            }))
            return db.into('yp_users').insert(preppedUsers)
        })

        const loginAttemptBody = {
            username: SampleTestUser.username,
            password: SampleTestUser.password
        }
            
        it('test function for working database', () => {
            helpers.checkUsers(db)
            .then(user => console.log(user))
        })
        
        it(`Happy path`, () => {
            const expectedToken = jwt.sign(
                {user_id: SampleTestUser.user_id}, 
                process.env.JWT_SECRET,
                {
                    subject: SampleTestUser.username,
                    expiresIn: config.JWT_EXPIRY,
                    algorithm: 'HS256',
                }
            )
            

            return supertest(app)
            .post('/api/login')
            .send(loginAttemptBody)
            .expect(200, {"authToken":expectedToken, payload: {user_id: SampleTestUser.user_id}})
        })
    })
})