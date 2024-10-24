require('dotenv').config();

const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;