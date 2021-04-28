const express = require("express");
const session = require("express-session");
const router = express.Router();
const firebase = require("firebase");

router.post("/endgame", async(req, res) => {
    if (!req.session.user) {
        return res.status(404);
    }
    const nickname = req.session.user.id;

    const db = firebase.firestore();
    const data = db.collection("users").doc(nickname);
    const update = await data.update({
        wins: req.session.user.data.wins + 1,
    });

    req.session.user.data.wins = req.session.user.data.wins + 1;

    req.session.save(() => {
        req.session.reload((err) => {
            if (err) {
                console.log(err);
            }
        });
    });
});

module.exports = router;