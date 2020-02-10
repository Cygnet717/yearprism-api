const express = require('express');
const path = require('path');
const eventsService = require('./events-service');
const { requireAuth } = require('../middleware/jwt-auth');

const eventsRouter = express.Router();
const jsonBodyParser = express.json();

eventsRouter
    .route('/')
    .all(requireAuth)
    .get(jsonBodyParser, (req, res, next) => {
        const user_id = req.body.user_id
        console.log(req.body)
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
       
        eventsService.serializeEvent(newEvent)

        eventsService.insertEvent(req.app.get('db'), newEvent)
        .then(event => {
            res.status(201)
                .json(event)
        })
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const {eventId} = req.body;
        const {user_id, eventdate, eventname, category} = req.body;
        const {notes} = req.body;
        const editedEvent = {user_id, eventdate, eventname, category};

        for(const [key, value] of Object.entries(editedEvent))
        if(value == null)
        return res.status(400).json({
            error: `Missing '${key}' in request body`
        })
        
        editedEvent.notes = notes;
       
        eventsService.serializeEvent(editedEvent)
        
        eventsService.updateEvent(req.app.get('db'), editedEvent, eventId)
        .then(edited => {
            res.status(200).json(edited)
        })
        .catch(error => console.log(error.message))
        })
    .delete(jsonBodyParser, (req, res, next) => {
        const {eventid} = req.body;

        eventsService.deleteEvent(req.app.get('db'), eventid)
        .then(event => res.status(204).json({error: {message: 'deleted'}}))
        .catch(next)
    })

module.exports = eventsRouter;
    