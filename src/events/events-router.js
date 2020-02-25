const express = require('express');
const eventsService = require('./events-service');
const { requireAuth } = require('../middleware/jwt-auth');

const eventsRouter = express.Router();
const jsonBodyParser = express.json();

eventsRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const user_id = req.user.user_id
        eventsService.getAllEvents(req.app.get('db'), user_id)
        .then(events => {
            res.json(events)
        })
        .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const {user_id, eventdate, eventname, category} = req.body;
        const {notes} = req.body;
        const newEvent = {user_id, eventdate, eventname, category};
        
        const types = ['Achievements', 'Body Modification', 'Family', 'Home', 'Job', 'Medical', 'Pets', 'Relationship', 'School', 'Vacation', 'Other']
   
        if(!types.find(i => i === newEvent.category)){
            return res.status(400).json({
                error: `Missing valid category`
            })
        }

        for(const [key, value] of Object.entries(newEvent))
        if(value == null)
        return res.status(400).json({
            error: `Missing '${key}' in request body`
        })
        
        newEvent.notes = notes;
        setImageIdName=(id)=>{
            newEvent.imagePubId = id
        }
        eventsService.serializeEvent(newEvent)

        eventsService.insertEvent(req.app.get('db'), newEvent)
        .then(event => {
            res.status(201)
                .json(event)
        })
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const eventId = req.body.eventid;
        const user_id = req.user.user_id;
        const {eventdate, eventname, category} = req.body;
        const {notes} = req.body;
        const editedEvent = {eventdate, eventname, category};

        const types = ['Achievements', 'Body Modification', 'Family', 'Home', 'Job', 'Medical', 'Pets', 'Relationship', 'School', 'Vacation', 'Other']

        
        if(!types.find(i => i === editedEvent.category)){
            return res.status(400).json({
                error: `Missing valid category`
            })
        }

        for(const [key, value] of Object.entries(editedEvent))
        if(value == null)
        return res.status(400).json({
            error: `Missing '${key}' in request body`
        })
        
        editedEvent.notes = notes;
        editedEvent.user_id = user_id;
        

        eventsService.serializeEvent(editedEvent)

        eventsService.updateEvent(req.app.get('db'), editedEvent, eventId)
        .then(edited => {
            res.status(200).json(edited)
        })
        .catch(error => console.log(error.message))
    })

eventsRouter
    .route('/:id')
    .all(requireAuth)
    .delete((req, res, next) => {
        const eventid = req.params.id;

        if(!eventid)
        return res.status(400).send('missing eventid')

        eventsService.deleteEvent(req.app.get('db'), eventid)
        .then(event => res.send(204))
        .catch(next)
    })

eventsRouter
    .route('/:year')
    .all(requireAuth)
    .get((req, res, next) => {
        const user_id = req.user.user_id;
        const year = req.params.year;
        
        eventsService.getAllYearEvents(req.app.get('db'), user_id, year)
        .then(events => {
            res.json(events.rows)
        })
        .catch(next)
    })

module.exports = eventsRouter;