const express = require('express');
const cors = require('cors');
const { event, userAuth, user } = require('./routers/index');

const app = express();

app.use(cors());
app.use(express.json());

app.use(userAuth);
app.use(event)
app.use(user);

app.listen(5000);
