const express = require("express");
const router = express.Router();
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const firebase = require("firebase");
router.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

router.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000,
        },
    })
);

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
});

// Pages required
const homepage = require("./src/home");
const username = require("./src/username");
const endgame = require("./src/endgame");
// Make routes
router.use("/", homepage);
router.use("/", username);
router.use("/", endgame);

module.exports = router;