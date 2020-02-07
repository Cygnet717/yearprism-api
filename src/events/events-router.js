const express = require('express');
const path = require('path');
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

        for(const [key, value] of Object.entries(newEvent))
        if(value == null)
        return res.status(400).json({
            error: `Missing '${key}' in request body`
        })
        
        newEvent.notes = notes;
       
        eventsService.serializeEvent(newEvent)
        console.log('here')
        eventsService.insertEvent(req.app.get('db'), newEvent)
        .then(event => {
            res.status(201)
                .json(event)
        })
    })

module.exports = eventsRouter;
    