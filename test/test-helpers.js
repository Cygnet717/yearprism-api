const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const app = require('../src/app')

function makeUsersArray() {
    return [
        {
        user_id: 1,
        username: "testUser",
	    birthyear: "1988",
	    password: "Password!1"
        },
        {
        user_id: 2,
        username: "2testUser",
        birthyear: "1999",
        password: "Password!1"
        },
    ]
}

function makeEventsArray(users) {
    return [
        {
            eventId: 1,
            user_id: users[0].user_id,
            eventDate: "2020-02-02",
            eventName: "test Event",
            category: "Achievements",
            notes: "test Notes"
        }
    ]
}

function makeTestUserFixtures() {
    const testusers = makeUsersArray()
    const testEvents = makeEventsArray(testusers)
    return {testusers, testEvents}
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
        yp_users,
        yp_events
        RESTART IDENTITY CASCADE`
    )
}

function seedUsers (db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('yp_users').insert(preppedUsers)
}

module.exports = {
    makeUsersArray,
    makeEventsArray,
    makeTestUserFixtures,
    cleanTables,
    seedUsers,

}