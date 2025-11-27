// backend/src/app.js
const express = require('express');
const cors = require('cors');

const studyRoutes = require('./routes/studyRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// API prefix: 실제 엔드포인트는 /api/studies 가 됨
app.use('/api/studies', studyRoutes);

module.exports = app;
