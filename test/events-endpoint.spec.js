const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Events Endpoints', function () {
    let db 

    const testUsers = helpers.makeTestUserFixtures();
    const oneTestUser = testUsers.usersArray[0];

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

    describe('GET /api/events', () => {
        beforeEach('insert users', () => {
            helpers.seedUsers(db, testUsers.usersArray)
        }) 
 
        //helpers.checkUsers(db)
        //.then(i => console.log(i))
        const authorizedUserToken = helpers.makeAuthHeader(oneTestUser)

        it('should get array of all events and status 200', () => {
            return supertest(app)
            .get('/api/events')
            .set('Authorization', authorizedUserToken)
            .expect(401, {error: 'mesage error'})
        })

        it('should return 401 unauthorized', () => {
            return supertest(app)
            .get('/api/events')
            .expect(401)
        })
    })
})