const express = require('express');
const event = new express.Router();
const { auth_admin, auth_user } = require("../middleware/auth");
const db = require("../db/prisma");

event.get('/event/list', async (req, res) => {
    try {
        const event = await db.event.findMany({
            select: {
                id: true,
                name: true,
                details:true,
                team_size:true,
                date_time:true,
                organizer:true
            }
        });
        res.status(200).send(event);
    } catch (e) {
        res.status(500).send("Internal Server Error");
    }
});

event.post('/event/link', auth_user, async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            res.status(400).send("Please enter the required fields");
            return;
        } else {
            const data = await db.participantEvents.findUnique({
                where: {
                    eventId_participantId: {
                        eventId: eventId,
                        participantId: req.user.userId
                    }
                }
            });
            if (data) {
                res.status(404).send("User is Already linked");
                return;
            } else {
                await db.participantEvents.create({
                    data: {
                        eventId: eventId,
                        participantId: req.user.userId
                    }
                })
                res.status(200).send("User Linked");
            }

        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

event.get('/event/registered', auth_user, async (req, res) => {
    try {
        const data = await db.participant.findMany({
            where: {
                id: req.user.userId
            },
            include: {
                password: false,
                role: false,
                name: false,
                id: false,
                email: false,
                date_time:false,
                ParticipantEvents: {
                    include: {
                        event: true,
                        eventId: false,
                        participantId: false
                    },
                },
            },
        });
        res.status(200).send(data.flatMap(participant => participant.ParticipantEvents.map(pe => pe.event)));
        } catch (e) {
        console.log(e);
        res.status(500).send('Internal Server Error');
    }
});

event.delete('/event/link', auth_admin, async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            res.status(400).send("Please enter the required fields");
        } else {
            await db.participantEvents.delete({
                where: {
                    eventId_participantId: {
                        eventId: eventId,
                        participantId: req.user.userId
                    }
                }
            });
            res.status(200).send("Relationship Removed");
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

event.get('/event/all_user/:event_id', auth_admin, async (req, res) => {
    try {
        const eventId  = parseInt(req.params.event_id);
        if (!eventId) {
            res.status(400).send("Please enter the required fields");
            return;
        }
        const data = await db.event.findMany({
            where: {
                id: eventId
            },
            include: {
                ParticipantEvents: {
                    include: {
                        participant: {
                            select: {
                                name: true,
                                id: true
                            }
                        },
                        eventId: false,
                        participantId: false
                    }
                }
            },
        })
        res.status(200).send(data.map(d => ({
            eventId: d.id,
            eventName : d.name,
            participants: d.ParticipantEvents.map(de => ({
                participantId : de.participant.id,
                participantName: de.participant.name
            }))
        })));
    } catch (e) {
        console.log(e)
        res.status(500).send('Internal Server Error');
    }
});

event.delete('/event/delete', auth_admin, async(req,res) => {
    try{
        const {eventId} = req.body;
        if(!eventId){
            res.status(400).send("Please enter the required fields");
            return;
        }
        await db.participantEvents.deleteMany({
            where: {
                eventId: eventId
            }
        });
        await db.event.delete({
            where: {
                id: eventId,
            }
        });
        res.status(200).send("Operation Sucessfull");
    } catch(e){
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

event.put('/event/create', auth_admin, async (req, res) => {
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

event.get('/event/participants', auth_admin, async (req, res) => {
    try {
        const participantsWithEvents = await db.participant.findMany({
            where: {
                role: "Participant"
            },
            include: {
                password: false,
                role: false,
                ParticipantEvents: {
                    include: {
                        event: true,
                        eventId: false,
                        participantId: false
                    },
                },
            },
        });
        res.json(participantsWithEvents.map(participant => ({
            id: participant.id,
            name: participant.name,
            email: participant.email,
            registeredEvents: participant.ParticipantEvents.map(pe => ({
                id: pe.event.id,
                name: pe.event.name
            }))
        })));
    } catch (error) {
        console.error('Error fetching participants with events:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = event;