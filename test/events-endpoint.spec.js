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
            return db.into('yp_users').insert(testUsers.usersArray)
        }) 

        beforeEach('insert events', () => {
            return db.into('yp_events').insert(testUsers.eventsArray)
        })

        it('responds with user info', () => {
            let resEventArray = [{ eventid: 1,
                user_id: 1,
                eventdate: '2020-02-02T06:00:00.000Z',
                eventname: 'test Event',
                category: 'Achievements',
                notes: 'test Notes' }]
            return supertest(app)
            .get('/api/users')
            .expect(200, resEventArray )
        })


 

        const authorizedUserToken = helpers.makeAuthHeader(oneTestUser)

        it('should get array of all events and status 200', () => {
            
            return supertest(app)
            .get(`/api/events`)
            .send(oneTestUser)
            .set('Authorization', authorizedUserToken)
            .expect(200)
        })

        it('should return 401 unauthorized', () => {
            return supertest(app)
            .get('/api/events')
            .expect(401)
        })
    })
})