const xss = require('xss')

const eventsService = {
    getAllEvents(db, id){
        return db
        .select('*')
        .from('yp_events')
        .where('user_id', id)
    },

    getAllYearEvents(db, id, year){
        return db
        .raw(`select * from yp_events
        where user_id=${id}
        and date_trunc('year', eventdate) ='${year}-01-01 00:00:00+00'`)
        
    },

    insertEvent(db, newEvent){
        return db
        .insert(newEvent)
        .into('yp_events')
        .returning('*')
        .then(([event]) => event)
    },

    serializeEvent(newEvent){
        return {
            eventdate: newEvent.eventDate,
            eventname: xss(newEvent.eventName),
            category: newEvent.category,
            notes: xss(newEvent.notes)
        }
    },

    updateEvent(db, editedEvent, id){
        return db('yp_events')
        .where({eventid: id})
        .update(editedEvent)
        .returning('*')
    },

    deleteEvent(db, id){
        return db('yp_events')
        .where({'eventid': id})
        .delete()
    }
}

module.exports = eventsService;