const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/prisma');
const moment = require('moment-timezone');

const User = new express.Router();
const dateTimeInGMTPlus530 = moment().tz('Asia/Kolkata').format();

User.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name && !email && !password) {
            return res.status(400).send('Please enter the required fields');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const data = await db.participant.findUnique({
            where: {
                email: email
            }
        });

        if (data) {
            res.status(409).send("User already exists");
        } else {
            await db.participant.create({
                data: {
                    name: name,
                    email: email,
                    date_time: new Date(dateTimeInGMTPlus530), 
                    password: hashedPassword,
                },
            });
            res.status(200).send('User created successfully');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});

User.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email && !password) {
            return res.status(400).send('Email is required');
        }

        const user = await db.participant.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(404).send("Invalid credentials");
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1hr' }
        );

        res.status(200).send({ message: "Login successful", token: token });
    } catch (err) {
        console.log(err);
        res.send(500).send("Internal Server Error");
    }
});

module.exports = User;