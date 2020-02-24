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

    const authorizedUserToken = helpers.makeAuthHeader(oneTestUser)

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

    describe(`POST /api/events`, () => {
        beforeEach('insert users', () => {
            return db.into('yp_users').insert(testUsers.usersArray)
        }) 


        it(`should insert new event`, () => {
            const newEvent = {
                user_id: 1,
                eventdate: '2020-02-02T06:00:00.000Z',
                eventname: 'new Event',
                category: 'Achievements',
                notes: 'new Notes'
            }

            return supertest(app)
            .post('/api/events')
            .send(newEvent)
            .set('Authorization', authorizedUserToken)
            .expect(201, {eventid: 1, ...newEvent})
        })
    })

    describe(`PATCH /api/events`, () => {
        beforeEach('insert users', () => {
            return db.into('yp_users').insert(testUsers.usersArray)
        }) 

        beforeEach('insert events', () => {
            return db.into('yp_events').insert(testUsers.eventsArray)
        })

        it('edits event data', () => {
            const editedEvent = {
                eventid: 1,
                user_id: 1,
                eventdate: "2020-02-02T06:00:00.000Z",
                eventname: "edited Event Name",
                category: "Achievements",
                notes: "test Notes"
            }
            return supertest(app)
            .patch('/api/events')
            .send(editedEvent)
            .set('Authorization', authorizedUserToken)
            .expect(200, [{...editedEvent}])
        })
    })

    describe(`DELETE /api/events:id`, () => {
        beforeEach('insert users', () => {
            return db.into('yp_users').insert(testUsers.usersArray)
        }) 

        beforeEach('insert events', () => {
            return db.into('yp_events').insert(testUsers.eventsArray)
        })

        it(`delete event from database`, () => {
            return supertest(app)
            .delete('/api/events/1')
            .set('Authorization', authorizedUserToken)
            .expect(204)
        })
    })

    describe(`get all events in a year`, () => {
        beforeEach('insert users', () => {
            return db.into('yp_users').insert(testUsers.usersArray)
        }) 

        beforeEach('insert events', () => {
            return db.into('yp_events').insert(testUsers.eventsArray)
        })

        it('gets all events in 2020', () => {
            const allYearEvents = testUsers.eventsArray;
            allYearEvents[0].eventdate = '2020-02-02T06:00:00.000Z'
            return supertest(app)
            .get('/api/events/2020')
            .set('Authorization', authorizedUserToken)
            .expect(200, allYearEvents)
        })
    })
})