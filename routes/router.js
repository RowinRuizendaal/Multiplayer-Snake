const express = require('express')
const router = express.Router();
require('dotenv').config();


// Pages required
const homepage = require('./src/home')

// Make routes
router.use('/', homepage)

module.exports = router