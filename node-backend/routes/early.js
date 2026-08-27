const express = require('express');
const {normalLimiter} = require('../utils/limiters');
const earlyRoutes = express.Router();
const {saveEarlyUser} = require('../controllers/early');

earlyRoutes.post('/', normalLimiter, saveEarlyUser);


module.exports = earlyRoutes