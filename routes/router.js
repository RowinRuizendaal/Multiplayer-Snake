const express = require("express");
const router = express.Router();
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const firebase = require("firebase");
const cors = require("cors");

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

const corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
};

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
});

const login = require("./src/username");
const lobby = require("./src/home");
const endgame = require("./src/endgame");

router.use("/", login);
router.use("/", lobby);
router.use("/", endgame, cors(corsOptions));

module.exports = router;