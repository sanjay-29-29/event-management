const express = require('express');
const db = require("../db/prisma");

const { auth_admin, auth_user } = require('../middleware/auth')

const user = express.Router();

user.get('/user/get_users', auth_admin, async (req, res) => {
    try {
        const data = await db.participant.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                date_time: true,
                role: true,
            }
        });
        res.send(data);
    } catch (e) {
        console.log(e);
        res.status(400).send("Internal Server Error");
    }
});

user.post('/user/getinfo', auth_user, async (req, res) => {
    try {
        const { userId } = req.user;
        const data = await db.participant.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                date_time: true,
                name: true,
                email: true,
                role: true
            }
        })
        res.status(200).send(data);
    } catch (e) {
        res.status(400).send("Internal Server Error");
    }
})

module.exports = user;