const express = require('express');
const cors = require('cors');

// Routes
const aquariumRoutes = require('./routes/aquariumRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(cors());

// Initialize routes
app.use('/api/aquarium', aquariumRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
