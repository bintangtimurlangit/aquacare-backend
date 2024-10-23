const express = require('express');
const cors = require('cors');

// Routes
const userRoutes = require('./routes/users');
const aquariumRoutes = require('./routes/aquariumRoutes');

const app = express();


app.use(express.json());

// Use aquarium routes
app.use('/api/users', aquariumRoutes);
app.use('/api/aquarium', aquariumRoutes);

module.exports = app;