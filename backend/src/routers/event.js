const express = require('express');
const event = new express.Router();
const { auth_admin, auth_user } = require("../middleware/auth");
const db = require("../db/prisma");
const { v4: uuidv4 } = require('uuid');

event.get('/event', async (req, res) => {
    try {
        const event = await db.event.findMany({
            select: {
                id: true,
                name: true,
                details: true,
                team_size: true,
                date_time: true,
                organizer: true
            }
        });
        res.status(200).send(event);
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
});


event.post('/event', auth_admin, async (req, res) => {
    try {
        const { name, details, organizer, team_size } = req.body;
        if (!(name && details && organizer && team_size)) {
            res.status(400).send("Please enter the required fields");
        } else {
            await db.event.create({
                data: {
                    name: name,
                    details: details,
                    organizer, organizer,
                    team_size: team_size
                }
            })
            res.status(200).send("Event created sucessfully");
        }
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
});

event.delete('/event', auth_admin, async(req,res) => {
    try{
        const {eventId} = req.body;
        if(!eventId){
            res.status(400).send("Please enter the required fields");
            return;
        }
        await db.team.deleteMany({
            where: {
                event_id: eventId,
            }
        });
        await db.event.deleteMany({
            where: {
                id: eventId
            }
        });
        res.status(200).send("Operation Sucessfull");
    } catch(e){
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

//TODO : put method

module.exports = event;